const Discord = require('discord.js');
const {getGuildConfig} = require("./guildConfig");

let lastLiveByLogin = new Map();
let hasBaseline = false;

let twitchToken;
let twitchTokenExpiresAt = 0;

async function getTwitchAppToken() {
	if (twitchToken && Date.now() < twitchTokenExpiresAt - 60_000) {
		return twitchToken;
	}

	const response = await fetch('https://id.twitch.tv/oauth2/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: process.env.TWITCH_TOKEN,
			client_secret: process.env.TWITCH_SECRET,
			grant_type: 'client_credentials',
		}),
	});

	if (!response.ok) {
		throw new Error(`Twitch token request failed: ${response.status} ${await response.text()}`);
	}

	const data = await response.json();
	twitchToken = data.access_token;
	twitchTokenExpiresAt = Date.now() + data.expires_in * 1000;

	return twitchToken;
}

async function getLiveStreams() {
	const token = await getTwitchAppToken();
	const url = new URL('https://api.twitch.tv/helix/streams');

	const response = await fetch(url, {
		headers: {
			'Client-ID': process.env.TWITCH_TOKEN,
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Twitch streams request failed: ${response.status} ${await response.text()}`);
	}

	const data = await response.json();
	return data.data;
}

function buildLiveEmbed(stream) {
	const thumbnail = stream.thumbnail_url
		.replace('{width}', '640')
		.replace('{height}', '360');

	const embed = new Discord.EmbedBuilder()
		.setColor(process.env.BOT_COLOR)
		.setTitle(`🔴 ${stream.user_name} est en direct !`)
		.setURL(`https://www.twitch.tv/${stream.user_login}`)
		.setDescription(stream.title)
		.addFields(
			{name: 'Catégorie', value: stream.game_name || 'Inconnue', inline: true},
			{name: 'Spectateurs', value: String(stream.viewers ?? 0), inline: true},
		)
		.setImage(thumbnail)
		.setFooter({
			text: 'Twitch',
			iconURL: 'attachment://twitch-footer.webp',
		});

	if (stream.started_at) {
		embed.setTimestamp(new Date(stream.started_at));
	}

	return embed;
}

async function sendLiveEmbedForGuild(bot, guild, stream) {
	const config = await getGuildConfig(bot, guild.id);

	if (!config.twitchAnnouncementChannel || !config.twitchNotifRole) {
		return;
	}

	const watchedLogins = String(config.twitchChannelUsernames ?? '')
		.split(/[,\s]+/)
		.map((login) => login.trim().toLowerCase())
		.filter(Boolean);

	if (!watchedLogins.includes(stream.user_login.toLowerCase())) {
		return;
	}

	const channel = guild.channels.cache.get(config.twitchAnnouncementChannel);

	if (!channel || typeof channel.send !== 'function') {
		return;
	}

	const notifRole = guild.roles.cache.get(config.twitchNotifRole);
	const embed = buildLiveEmbed(stream);
	const twitchFooter = new Discord.AttachmentBuilder('./src/Assets/twitch-footer.webp');

	await channel.send({
		content: `${stream.user_name} est en direct sur Twitch ! ${notifRole}`,
		embeds: [embed],
		files: [twitchFooter],
	});
}

module.exports = async (bot) => {
	const streams = await getLiveStreams();
	const currentLiveByLogin = new Map(
		streams.map(stream => [stream.user_login.toLowerCase(), stream]),
	);

	const newLiveStreams = [];

	if (hasBaseline) {
		for (const [login, stream] of currentLiveByLogin) {
			const previousStream = lastLiveByLogin.get(login);

			if (!previousStream || previousStream.id !== stream.id) {
				newLiveStreams.push(stream);
			}
		}
	}

	lastLiveByLogin = currentLiveByLogin;
	hasBaseline = true;

	if (newLiveStreams.length === 0) {
		return;
	}

	for (const guild of bot.guilds.cache.values()) {
		for (const stream of newLiveStreams) {
			try {
				await sendLiveEmbedForGuild(bot, guild, stream);
			} catch (error) {
				bot.function.botLogsFile.error(
					`Échec de la notification Twitch pour ${stream.user_login} (serveur ${guild.id}) :`,
					error
				);
			}
		}
	}
}
