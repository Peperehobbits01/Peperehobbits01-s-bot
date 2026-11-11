const Discord = require('discord.js');
const {getGuildConfig} = require("./guildConfig");

const channelDataCache = new Map();

function parseYouTubeChannelIds(rawValue) {
	if (!rawValue) return [];
	if (Array.isArray(rawValue)) {
		return rawValue.map((id) => String(id).trim()).filter(Boolean);
	}
	return String(rawValue)
		.split(/[,\s]+/)
		.map((id) => id.trim())
		.filter(Boolean);
}

async function saveLastVideoId(guildId, YouTubeChannelId, videoId, bot) {
	const checkYouTubeDBInitialasation = await bot.function.executeQuery(`SELECT lastVideoId FROM subscribed_youtube_channels WHERE guildId = '${guildId}' AND channelId = '${YouTubeChannelId}'`, bot);

	if (checkYouTubeDBInitialasation.length < 1) {
		await bot.function.executeQuery(`INSERT INTO subscribed_youtube_channels (guildId, channelId, lastVideoId) VALUES ('${guildId}', '${YouTubeChannelId}', '${videoId}')`, bot);
	} else {
		await bot.function.executeQuery(`UPDATE subscribed_youtube_channels SET lastVideoId = '${videoId}' WHERE guildId = '${guildId}' AND channelId = '${YouTubeChannelId}'`, bot);
	}
}

async function fetchYouTubeApi(resource, params) {
	const url = new URL(`https://www.googleapis.com/youtube/v3/${resource}`);
	for (const [key, value] of Object.entries({...params, key: process.env.YOUTUBE_API_KEY?.trim()})) {
		url.searchParams.set(key, value);
	}

	const response = await fetch(url.toString());
	const data = await response.json();
	if (!response.ok) {
		throw new Error(`YouTube Data API ${resource} request failed (${response.status}): ${data.error?.message || response.statusText}`);
	}

	return data;
}

async function getYouTubeChannelData(channelId) {
	if (channelDataCache.has(channelId)) {
		return channelDataCache.get(channelId);
	}

	const response = await fetchYouTubeApi("channels", {
		part: "snippet,contentDetails",
		id: channelId,
	});
	const channel = response.items?.[0];
	if (!channel) {
		throw new Error(`YouTube channel ${channelId} was not found.`);
	}

	const data = {
		name: channel.snippet.title,
		uploadsPlaylistId: channel.contentDetails.relatedPlaylists.uploads,
	};
	if (!data.uploadsPlaylistId) {
		throw new Error(`YouTube did not return an uploads playlist for channel ${channelId}.`);
	}

	channelDataCache.set(channelId, data);
	return data;
}

let isChecking = false;
let missingApiKeyLogged = false;

async function checkYouTubeChannel(bot, guild, YouTubeChannelId, config) {
	try {
		const channelData = await getYouTubeChannelData(YouTubeChannelId);
		const playlist = await fetchYouTubeApi("playlistItems", {
			part: "snippet,contentDetails",
			playlistId: channelData.uploadsPlaylistId,
			maxResults: "5",
		});

		if (!playlist.items || playlist.items.length === 0) {
			return;
		}

		const channelName = channelData.name;
		const videos = playlist.items.map((item) => {
			const videoId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
			if (!videoId) return null;

			return {
				id: videoId,
				title: item.snippet.title,
				link: `https://www.youtube.com/watch?v=${videoId}`,
				description: item.snippet.description,
				publishedAt: new Date(item.contentDetails.videoPublishedAt || item.snippet.publishedAt),
			};
		}).filter(Boolean);

		if (videos.length === 0) {
			return;
		}

		const lastVideoResult = await bot.function.executeQuery(`SELECT lastVideoId FROM subscribed_youtube_channels WHERE guildId = '${guild.id}' AND channelId = '${YouTubeChannelId}'`, bot);

		if (lastVideoResult.length < 1) {
			await saveLastVideoId(guild.id, YouTubeChannelId, videos[0].id, bot);

			bot.function.botLogsFile.info(`Référence initiale YouTube définie sur ${videos[0].id} (${YouTubeChannelId}) pour le serveur ${guild.id}`);
			return;
		}

		const lastVideoId = lastVideoResult[0].lastVideoId;
		const lastVideoIndex = videos.findIndex(
			(video) => video.id === lastVideoId
		);

		let newVideos;

		if (lastVideoIndex === -1) {
			newVideos = [videos[0]];
		} else {
			newVideos = videos.slice(0, lastVideoIndex).reverse();
		}

		if (newVideos.length === 0) {
			return;
		}

		const announcementChannel = guild.channels.cache.get(config.youtubeAnnouncementChannel)

		if (!announcementChannel) {
			bot.function.botLogsFile.warn(`Aucun salon d'annonce YouTube configuré pour le serveur ${guild.id}, publication ignorée.`);
			await saveLastVideoId(guild.id, YouTubeChannelId, videos[0].id, bot);
			return;
		}

		const notifMention = guild.roles.cache.get(config.youtubeNotifRole)

		for (const video of newVideos) {
			let description = String(video.description || "");

			if (description.length > 250) {
				description = `${description.slice(0, 247)}...`
			}

			const YouTubeImage = new Discord.AttachmentBuilder('./src/Assets/youtube-footer.png')

			const embed = new Discord.EmbedBuilder()
				.setAuthor({
					name: channelName,
				})
				.setColor("#FF0000")
				.setTitle(video.title)
				.setURL(video.link)
				.setDescription("Une nouvelle vidéo a été publiée.\n\n**Description :**\n" + description)
				.setImage(`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`)
				.setFooter({
					text: "YouTube",
					iconURL: "attachment://youtube-footer.png",
				});

			if (!Number.isNaN(video.publishedAt.getTime())) {
				embed.setTimestamp(video.publishedAt);
			}

			await announcementChannel.send({
				content: `${channelName} a publié une nouvelle vidéo ! ${notifMention}`,
				embeds: [embed],
				files: [YouTubeImage],
			});
		}

		await saveLastVideoId(guild.id, YouTubeChannelId, videos[0].id, bot);
	} catch (error) {
		throw new Error(`La vérification de la chaîne YouTube ${YouTubeChannelId} a échoué : ${error.message}`);
	}
}

module.exports = async (bot) => {
	if (!process.env.YOUTUBE_API_KEY?.trim()) {
		if (!missingApiKeyLogged) {
			bot.function.botLogsFile.info("La vérification des vidéos YouTube est désactivée : YOUTUBE_API_KEY n'est pas configurée.");
			missingApiKeyLogged = true;
		}
		return;
	}

	missingApiKeyLogged = false;
	if (isChecking) return;

	isChecking = true;

	try {
		for (const [guildId, guild] of bot.guilds.cache) {
			const config = await getGuildConfig(bot, guildId);
			const channelIds = parseYouTubeChannelIds(config.youtubeChannelIds);

			for (const YouTubeChannelId of channelIds) {
				await checkYouTubeChannel(bot, guild, YouTubeChannelId, config);
			}
		}
	} finally {
		isChecking = false;
	}
}
