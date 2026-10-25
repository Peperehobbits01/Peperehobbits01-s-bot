const Discord = require("discord.js");
const path = require("node:path");
const {getGuildConfig} = require("./guildConfig");

const TWITCH_STREAMS_URL = "https://api.twitch.tv/helix/streams";
const TWITCH_GAMES_URL = "https://api.twitch.tv/helix/games";
const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const TWITCH_USERNAMES_PER_REQUEST = 100;
const REQUEST_TIMEOUT_MS = 15_000;

let notifiedStreamByGuildLogin = new Map();
let hasBaseline = false;
let isChecking = false;
let twitchToken;
let twitchTokenExpiresAt = 0;

function getTwitchCredentials(bot) {
	const clientId = process.env.TWITCH_CLIENT_ID || process.env.TWITCH_TOKEN;
	const clientSecret = process.env.TWITCH_CLIENT_SECRET || process.env.TWITCH_SECRET;

	if (!clientId || !clientSecret) {
		throw new Error("Les identifiants Twitch n'ont pas été trouver")
	}

	return {clientId, clientSecret};
}

async function getTwitchAppToken(forceRefresh = false, bot) {
	if (!forceRefresh && twitchToken && Date.now() < twitchTokenExpiresAt - 60_000) {
		return twitchToken;
	}

	const {clientId, clientSecret} = getTwitchCredentials(bot);
	const response = await fetch(TWITCH_TOKEN_URL, {
		method: "POST",
		headers: {"Content-Type": "application/x-www-form-urlencoded"},
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: "client_credentials",
		}),
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});

	if (!response.ok) {
		throw new Error(`La requête du token auprès de Twitch a échoué : ${response.status} ${await response.text()}`);
	}

	const data = await response.json();
	if (!data.access_token || !Number.isFinite(Number(data.expires_in))) {
		throw new Error("La réponse de Twitch ne contenait pas un token ou une date d'expiration valide.");
	}

	twitchToken = data.access_token;
	twitchTokenExpiresAt = Date.now() + Number(data.expires_in) * 1000;
	return twitchToken;
}

async function fetchTwitchApi(url, bot) {
	const {clientId} = getTwitchCredentials(bot);
	let response;
	for (let attempt = 0; attempt < 2; attempt += 1) {
		const token = await getTwitchAppToken(attempt === 1, bot);
		response = await fetch(url, {
			headers: {
				"Client-ID": clientId,
				Authorization: `Bearer ${token}`,
			},
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});

		if (response.status !== 401 || attempt === 1) break;
		twitchToken = undefined;
		twitchTokenExpiresAt = 0;
	}

	return response;
}

function parseTwitchLogins(rawValue) {
	const values = Array.isArray(rawValue) ? rawValue : String(rawValue ?? "").split(/[,\s]+/);
	return [...new Set(values
		.map((login) => String(login).trim().toLowerCase())
		.filter((login) => /^[a-z0-9_]{1,25}$/.test(login)))];
}

async function getLiveStreams(logins, bot) {
	const streams = [];

	for (let index = 0; index < logins.length; index += TWITCH_USERNAMES_PER_REQUEST) {
		const batch = logins.slice(index, index + TWITCH_USERNAMES_PER_REQUEST);
		const url = new URL(TWITCH_STREAMS_URL);
		for (const login of batch) {
			url.searchParams.append("user_login", login);
		}

		const response = await fetchTwitchApi(url, bot);

		if (!response.ok) {
			throw new Error(`Requête des streams auprès de Twitch échoué : ${response.status} ${await response.text()}`);
		}

		const data = await response.json();
		if (!Array.isArray(data.data)) {
			throw new Error("La réponse de Twitch ne contenait pas data.");
		}
		streams.push(...data.data);
	}

	return streams;
}

async function getGameImages(streams, bot) {
	const gameIds = [...new Set(streams.map((stream) => stream.game_id).filter(Boolean))];
	const gameImages = new Map();
	if (gameIds.length === 0) return gameImages;

	for (let index = 0; index < gameIds.length; index += TWITCH_USERNAMES_PER_REQUEST) {
		const url = new URL(TWITCH_GAMES_URL);
		for (const gameId of gameIds.slice(index, index + TWITCH_USERNAMES_PER_REQUEST)) {
			url.searchParams.append("id", gameId);
		}

		const response = await fetchTwitchApi(url, bot);

		if (!response.ok) {
			throw new Error(`Requête des catégories auprès de Twitch échouée : ${response.status} ${await response.text()}`);
		}

		const data = await response.json();
		if (!Array.isArray(data.data)) {
			throw new Error("La réponse des catégories Twitch ne contenait pas data.");
		}

		for (const game of data.data) {
			if (game.box_art_url) gameImages.set(game.id, game.box_art_url);
		}
	}

	return gameImages;
}

function buildLiveEmbed(stream, gameImageUrl) {
	const embed = new Discord.EmbedBuilder()
		.setColor(process.env.BOT_COLOR)
		.setTitle(stream.title)
		.setURL(`https://www.twitch.tv/${stream.user_login}`)
		.setDescription(`🔴 ${stream.user_name} est en direct !`)
		.addFields(
			{name: "Catégorie", value: stream.game_name, inline: true},
			{name: "Spectateurs", value: String(stream.viewer_count), inline: true},
		)
		.setFooter({
			text: "Twitch",
			iconURL: "attachment://twitch-footer.webp",
		});

	if (gameImageUrl) {
		embed.setThumbnail(gameImageUrl.replace("{width}", "285").replace("{height}", "380"));
	}

	if (stream.thumbnail_url) {
		embed.setImage(stream.thumbnail_url.replace("{width}", "640").replace("{height}", "360"));
	}

	if (stream.started_at && !Number.isNaN(Date.parse(stream.started_at))) {
		embed.setTimestamp(new Date(stream.started_at));
	}

	return embed;
}

async function sendLiveEmbedForGuild(guild, stream, config, gameImages) {
	const channel = guild.channels.cache.get(config.twitchAnnouncementChannel);
	const role = guild.roles.cache.get(config.twitchNotifRole);

	if (!channel || typeof channel.send !== "function") {
		throw new Error(`Configured Twitch announcement channel was not found in guild ${guild.id}.`);
	}
	if (!role) {
		throw new Error(`Configured Twitch notification role was not found in guild ${guild.id}.`);
	}

	const attachment = new Discord.AttachmentBuilder(
		path.join(__dirname, "../Assets/twitch-footer.webp"),
	);
	await channel.send({
		content: `${stream.user_name} est en direct sur Twitch ! <@&${role.id}>`,
		embeds: [buildLiveEmbed(stream, gameImages.get(stream.game_id))],
		files: [attachment],
		allowedMentions: {parse: [], roles: [role.id]},
	});
}

module.exports = async (bot) => {
	if (isChecking) return;
	isChecking = true;

	try {
		const guildsByLogin = new Map();

		for (const guild of bot.guilds.cache.values()) {
			const config = await getGuildConfig(bot, guild.id);
			if (!config.twitchAnnouncementChannel || !config.twitchNotifRole) continue;

			for (const login of parseTwitchLogins(config.twitchChannelUsernames)) {
				if (!guildsByLogin.has(login)) guildsByLogin.set(login, []);
				guildsByLogin.get(login).push({guild, config});
			}
		}

		const logins = [...guildsByLogin.keys()];
		const streams = logins.length > 0 ? await getLiveStreams(logins, bot) : [];
		const activeGuildLogins = new Set();

		for (const [login, subscribers] of guildsByLogin) {
			for (const {guild} of subscribers) {
				activeGuildLogins.add(`${guild.id}:${login}`);
			}
		}
		for (const key of notifiedStreamByGuildLogin.keys()) {
			if (!activeGuildLogins.has(key)) notifiedStreamByGuildLogin.delete(key);
		}

		if (!hasBaseline) {
			for (const stream of streams) {
				const login = stream.user_login.toLowerCase();
				for (const {guild} of guildsByLogin.get(login) ?? []) {
					notifiedStreamByGuildLogin.set(`${guild.id}:${login}`, stream.id);
				}
			}
			hasBaseline = true;
			return;
		}

		const streamsToNotify = streams.filter((stream) => {
			const login = stream.user_login.toLowerCase();
			return (guildsByLogin.get(login) ?? []).some(({guild}) =>
				notifiedStreamByGuildLogin.get(`${guild.id}:${login}`) !== stream.id);
		});

		let gameImages = new Map();
		if (streamsToNotify.length > 0) {
			try {
				gameImages = await getGameImages(streamsToNotify, bot);
			} catch (error) {
				bot.function.botLogsFile.error("Échec de la récupération des images de catégories Twitch :", error);
			}
		}

		for (const stream of streamsToNotify) {
			const login = stream.user_login.toLowerCase();
			for (const {guild, config} of guildsByLogin.get(login) ?? []) {
				const key = `${guild.id}:${login}`;
				if (notifiedStreamByGuildLogin.get(key) === stream.id) continue;

				try {
					await sendLiveEmbedForGuild(guild, stream, config, gameImages);
					notifiedStreamByGuildLogin.set(key, stream.id);
				} catch (error) {
					bot.function.botLogsFile.error(
						`Échec de la notification Twitch pour ${login} (serveur ${guild.id}) :`,
						error,
					);
				}
			}
		}
	} finally {
		isChecking = false;
	}
};
