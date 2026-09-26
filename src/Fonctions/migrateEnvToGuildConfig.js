const {executeQuery} = require("./databaseConnect");
const {setGuildConfig} = require("./guildConfig");
const botLogsFile = require("./botLogsFile");

const ENV_TO_CONFIG_KEY = {
	WELCOME_CHANNEL: "welcomeChannel",
	LEVEL_PASS_CHANNEL: "levelPassChannel",
	COUNTING_CHANNEL: "countingChannel",
	REPORT_CHANNEL: "reportChannel",
	LOGS_CHANNEL_MEMBER: "logsChannelMember",
	LOGS_CHANNEL_VOICE: "logsChannelVoice",
	LOGS_CHANNEL_CHANNEL: "logsChannelChannel",
	LOGS_CHANNEL_GUILD: "logsChannelGuild",
	LOGS_CHANNEL_SANCTIONS: "logsChannelSanctions",
	LOGS_CHANNEL_MESSAGE: "logsChannelMessage",
	LOGS_CHANNEL_GATEWAY: "logsChannelGateway",
	BOOSTER_CHANNEL: "boosterChannel",
	BOOSTER_ROLE: "boosterRole",
	MOM_ROLE: "momRole",
	EVENT_WINNER_ROLE: "eventWinnerRole",
};

function buildInitialConfigFromEnv() {
	const initial = {};
	for (const [envKey, configKey] of Object.entries(ENV_TO_CONFIG_KEY)) {
		if (process.env[envKey]) initial[configKey] = process.env[envKey];
	}
	if (process.env.YOUTUBE_CHANNEL_ID) {
		initial.youtubeChannelIds = String(process.env.YOUTUBE_CHANNEL_ID)
			.split(/[,\s]+/)
			.map((v) => v.trim())
			.filter(Boolean);
	}
	if (process.env.YOUTUBE_ANNOUNCEMENT_CHANNEL) {
		initial.youtubeAnnouncementChannel = process.env.YOUTUBE_ANNOUNCEMENT_CHANNEL;
	}
	if (process.env.YOUTUBE_NOTIF_ROLE) {
		initial.youtubeNotifRole = process.env.YOUTUBE_NOTIF_ROLE;
	}
	return initial;
}

async function isTableEmpty() {
	const rows = await executeQuery("SELECT COUNT(*) AS count FROM guild_config");
	return rows && rows.length > 0 && Number(rows[0].count) === 0;
}

/**
 * One-shot startup migration: if guild_config is empty, populate every
 * guild in bot.guilds.cache with the current .env values. Subsequent
 * invocations are no-ops.
 *
 * @param {import('discord.js').Client} bot
 */
async function migrateEnvToGuildConfig(bot) {
	try {
		const hasRows = await executeQuery("SELECT COUNT(*) AS count FROM guild_config");
		const count = hasRows && hasRows.length > 0 ? Number(hasRows[0].count) : 0;

		if (count > 0) {
			botLogsFile.info(
				`Migration .env -> guild_config : déjà effectuée (${count} lignes existantes), pass`
			);
			return;
		}

		const initialConfig = buildInitialConfigFromEnv();

		let migrated = 0;
		let failed = 0;

		for (const guild of bot.guilds.cache.values()) {
			try {
				await setGuildConfig(guild.id, initialConfig);
				// setGuildConfig already updated the in-memory cache for
				// this guild, so the first subsequent read returns the
				// migrated value, not the defaults.
				migrated += 1;
			} catch (error) {
				failed += 1;
				botLogsFile.error(`Migration .env -> guild_config pour ${guild.id} :`, error);
			}
		}

		botLogsFile.info(
			`Migration .env -> guild_config terminée : ${migrated} guild(s) migrée(s), ${failed} échec(s).`
		);
	} catch (error) {
		botLogsFile.error("Migration .env -> guild_config : erreur générale :", error);
	}
}

module.exports = {
	buildInitialConfigFromEnv,
	isTableEmpty,
	migrateEnvToGuildConfig,
};
