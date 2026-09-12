const Discord = require('discord.js');
let Parser = require("rss-parser");
let parser = new Parser();
const fs = require("fs");
const botLogsFile = require("./botLogsFile");
const STATE_FILE = "./cache/youtube-state.json";

function getYoutubeChannelIds() {
	if (!process.env.YOUTUBE_CHANNEL_ID) return [];

	return process.env.YOUTUBE_CHANNEL_ID
		.split(/[,\s]+/)
		.map((id) => id.trim())
		.filter(Boolean);
}

function loadLastVideoId(YouTubeChannelId) {
	if (!fs.existsSync(STATE_FILE)) {
		return null;
	}

	try {
		const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
		return state[YouTubeChannelId] || null;
	} catch {
		return null;
	}
}

function saveLastVideoId(YouTubeChannelId, videoId) {
	if (!fs.existsSync(STATE_FILE)) {
		fs.writeFileSync(STATE_FILE, JSON.stringify({}, null, 2), "utf8");
	}

	const state = fs.existsSync(STATE_FILE)
		? JSON.parse(fs.readFileSync(STATE_FILE, "utf8"))
		: {};

	state[YouTubeChannelId] = videoId;

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

		// Handles path-style URLs such as /shorts/<id>, /watch/<id>, /live/<id>, /v/<id>.
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

async function checkYouTubeChannel(bot, YouTubeChannelId) {
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
				title: item.title || "Nouvelle vidéo YouTube",
				link: item.link,
				description: item.contentSnippet || item.content || "",
				publishedAt: item.isoDate
					? new Date(item.isoDate)
					: new Date(item.pubDate),
			}))
			.filter((video) => video.id);

		if (videos.length === 0) {
			return;
		}

		let lastVideoId = loadLastVideoId(YouTubeChannelId);

		if (!lastVideoId) {
			lastVideoId = videos[0].id;
			saveLastVideoId(YouTubeChannelId, lastVideoId);

			botLogsFile.info(
				`Référence initiale YouTube définie sur ${lastVideoId} (${YouTubeChannelId})`
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

		const channel = await bot.channels.fetch(
			process.env.YOUTUBE_ANNOUNCEMENT_CHANNEL
		);

		for (const video of newVideos) {
			const description =
				video.description.length > 1000
					? `${video.description.slice(0, 997)}...`
					: video.description;

			const embed = new Discord.EmbedBuilder()
				.setColor(process.env.BOT_COLOR)
				.setTitle(video.title)
				.setURL(video.link)
				.setDescription(description || "Une nouvelle vidéo a été publiée.")
				.setThumbnail(
					`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
				)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					icon_url: bot.displayAvatarURL({ dynamic: true }),
				});

			if (!Number.isNaN(video.publishedAt.getTime())) {
				embed.setTimestamp(video.publishedAt);
			}

			await channel.send({
				content: `${channelName} a publié une nouvelle vidéo ! ${process.env.YOUTUBE_NOTIF_ROLE}`,
				embeds: [embed],
			});
		}

		lastVideoId = videos[0].id;
		saveLastVideoId(YouTubeChannelId, lastVideoId);
	} catch (error) {
		botLogsFile.error("Une erreur est survenue pour la détection YouTube :", error);
	}
}

module.exports = async (bot) => {
	if (isChecking) return;

	isChecking = true;

	try {
		for (const YouTubeChannelId of getYoutubeChannelIds()) {
			try {
				await checkYouTubeChannel(bot, YouTubeChannelId);
			} catch (error) {
				botLogsFile.error(
					`Erreur lors du check de ${YouTubeChannelId} :`, error
				);
			}
		}
	} finally {
		isChecking = false;
	}
}
