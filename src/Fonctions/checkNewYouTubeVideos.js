const Discord = require('discord.js');
let Parser = require("rss-parser");
let parser = new Parser({
	customFields: {
		item: [
			["media:group", "media:group"],
		],
	},
});
const fs = require("fs");
const botLogsFile = require("./botLogsFile");
const {getGuildConfig} = require("./guildConfig");
const STATE_FILE = "./cache/youtube-state.json";

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

function stateKey(guildId, channelId) {
	return `${guildId}:${channelId}`;
}

function loadLastVideoId(guildId, YouTubeChannelId) {
	if (!fs.existsSync(STATE_FILE)) {
		return null;
	}

	try {
		const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
		return state[stateKey(guildId, YouTubeChannelId)] || null;
	} catch {
		return null;
	}
}

function saveLastVideoId(guildId, YouTubeChannelId, videoId) {
	if (!fs.existsSync(STATE_FILE)) {
		fs.writeFileSync(STATE_FILE, JSON.stringify({}, null, 2), "utf8");
	}

	const state = fs.existsSync(STATE_FILE)
		? JSON.parse(fs.readFileSync(STATE_FILE, "utf8"))
		: {};

	state[stateKey(guildId, YouTubeChannelId)] = videoId;

	fs.writeFile(
		STATE_FILE,
		JSON.stringify(state, null, 2),
		"utf8",
		(err) => {
			if (err) {
				botLogsFile.error("Une erreur est survenue lors de l'écriture du cache YouTube :", err);
			}
		}
	);
}

function getVideoId(item) {
	const idPatterns = [item.id, item.guid].filter(Boolean);

	for (const value of idPatterns) {
		const match = String(value).match(/yt:video:([^&/]+)/);
		if (match) return match[1];
	}

	if (item.link) {
		let url;
		try {
			url = new URL(item.link);
		} catch {
			return null;
		}

		const v = url.searchParams.get("v");
		if (v) return v;

		const specialKinds = ["watch", "shorts", "live", "v", "embed", "embeds"];
		const parts = url.pathname.split("/").filter(Boolean);
		const idx = parts.findIndex((part) => specialKinds.includes(part));
		if (idx !== -1 && parts[idx + 1]) {
			return parts[idx + 1];
		}
	}

	return null;
}

let isChecking = false;

async function checkYouTubeChannel(bot, guild, YouTubeChannelId, config) {
	const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YouTubeChannelId}`;

	try {
		const feed = await parser.parseURL(feedUrl);

		if (!feed.items || feed.items.length === 0) {
			return;
		}

		const channelName = feed.title
			.replace(/\s*-\s*YouTube\s*$/i, "")
			.trim();

		const videos = feed.items
			.map((item) => ({
				id: getVideoId(item),
				title: item.title,
				link: item.link,
				description: item["media:group"]?.["media:description"],
				publishedAt: item.isoDate
					? new Date(item.isoDate)
					: new Date(item.pubDate),
			}))
			.filter((video) => video.id);

		if (videos.length === 0) {
			return;
		}

		let lastVideoId = loadLastVideoId(guild.id, YouTubeChannelId);

		if (!lastVideoId) {
			lastVideoId = videos[0].id;
			saveLastVideoId(guild.id, YouTubeChannelId, lastVideoId);

			botLogsFile.info(
				`Référence initiale YouTube définie sur ${lastVideoId} (${YouTubeChannelId}) pour le serveur ${guild.id}`
			);
			return;
		}

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
			botLogsFile.warn(
				`Aucun salon d'annonce YouTube configuré pour le serveur ${guild.id}, publication ignorée.`
			);
			lastVideoId = videos[0].id;
			saveLastVideoId(guild.id, YouTubeChannelId, lastVideoId);
			return;
		}

		const notifMention = guild.roles.cache.get(config.youtubeNotifRole)

		for (const video of newVideos) {
			let description = video.description

			if (description.length > 500) {
				description = `${description.slice(0, 497)}...`
			}

			const embed = new Discord.EmbedBuilder()
				.setAuthor({
					name: channelName,
					iconURL: channelName.iconURL
				})
				.setColor(process.env.BOT_COLOR)
				.setTitle(video.title)
				.setURL(video.link)
				.setDescription("Une nouvelle vidéo a été publiée.\n" + description)
				.setThumbnail(
					`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
				)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					icon_url: bot.user.displayAvatarURL({ dynamic: true }),
				});

			if (!Number.isNaN(video.publishedAt.getTime())) {
				embed.setTimestamp(video.publishedAt);
			}

			await announcementChannel.send({
				content: `${channelName} a publié une nouvelle vidéo ! ${notifMention}`,
				embeds: [embed],
			});
		}

		lastVideoId = videos[0].id;
		saveLastVideoId(guild.id, YouTubeChannelId, lastVideoId);
	} catch (error) {
		botLogsFile.error("Une erreur est survenue pour la détection YouTube :", error);
	}
}

module.exports = async (bot) => {
	if (isChecking) return;

	isChecking = true;

	try {
		for (const [guildId, guild] of bot.guilds.cache) {
			const config = await getGuildConfig(guildId);
			const channelIds = parseYouTubeChannelIds(config.youtubeChannelIds);

			for (const YouTubeChannelId of channelIds) {
				try {
					await checkYouTubeChannel(bot, guild, YouTubeChannelId, config);
				} catch (error) {
					botLogsFile.error(
						`Erreur lors du check de ${YouTubeChannelId} (${guildId}) :`, error
					);
				}
			}
		}
	} finally {
		isChecking = false;
	}
}
