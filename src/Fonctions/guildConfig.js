const {DEFAULT_GUILD_CONFIG, GUILD_CONFIG_SCHEMA} = require("../Enum/defaultGuildConfig");
const {CURRENT_VERSION} = require("./guildConfigMigrations");

const cache = new Map();

function normalizeValue(key, value) {
	if (value === undefined || value === null || value === "") {
		return null;
	}

	if (GUILD_CONFIG_SCHEMA[key].type === "snowflake") {
		return String(value);
	}

	if (GUILD_CONFIG_SCHEMA[key].type === "list") {
		if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
		return String(value).split(/[,\s]+/).map((v) => v.trim()).filter(Boolean);
	}

	return value;
}

async function getGuildConfig(bot, guildId) {
	const id = String(guildId);
	if (cache.has(id)) return cache.get(id);

	let rows;
	try {
		rows = await bot.function.executeQuery(["SELECT config FROM guild_config WHERE guild_id = ?", [id]], bot);
	} catch (error) {
		bot.function.botLogsFile.error(`Erreur lors de la lecture de la config de ${id} :`, error);
		rows = undefined;
	}

	let config = DEFAULT_GUILD_CONFIG

	if (rows && rows.length > 0) {
		try {
			const stored = typeof rows[0].config === "string" ? JSON.parse(rows[0].config) : rows[0].config;
			if (stored && typeof stored === "object") {
				config = {...config, ...stored};
			}
		} catch (error) {
			bot.function.botLogsFile.error(`Config invalide pour ${id}, utilisation des valeurs par défaut :`, error);
			config = DEFAULT_GUILD_CONFIG
		}
	}

	cache.set(id, config);
	return config;
}

async function setGuildConfig(bot, guildId, changes) {
	const current = await getGuildConfig(bot, guildId);
	const merged = {...current};

	for (const [key, value] of Object.entries(changes)) {
		merged[key] = normalizeValue(key, value);
	}

	const configJson = JSON.stringify(merged);
	await bot.function.executeQuery([
		`INSERT INTO guild_config (guild_id, config, version) VALUES (?, ?, ?)
		 ON DUPLICATE KEY UPDATE config = VALUES(config), version = VALUES(version)`,
		[guildId, configJson, CURRENT_VERSION],
	], bot);

	cache.set(guildId, merged);
	return merged;
}

module.exports = {
	cache,
	getGuildConfig,
	setGuildConfig,
};
