const {executeQuery} = require("./databaseConnect");
const {getGuildConfigDefaults, GUILD_CONFIG_SCHEMA} = require("./defaultGuildConfig");
const botLogsFile = require("./botLogsFile");

const cache = new Map();

function normalizeValue(key, value) {
	const schema = GUILD_CONFIG_SCHEMA[key];
	if (!schema) return value;

	if (value === undefined || value === null || value === "") {
		return null;
	}

	if (schema.type === "snowflake") {
		return String(value);
	}

	if (schema.type === "list") {
		if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
		return String(value).split(/[,\s]+/).map((v) => v.trim()).filter(Boolean);
	}

	return value;
}

async function getGuildConfig(guildId) {
	const id = String(guildId);
	if (cache.has(id)) return cache.get(id);

	let rows;
	try {
		rows = await executeQuery(["SELECT config FROM guild_config WHERE guild_id = ?", [id]]);
	} catch (error) {
		botLogsFile.error(`Erreur lors de la lecture de la config de ${id} :`, error);
		rows = undefined;
	}

	let config = getGuildConfigDefaults();

	if (rows && rows.length > 0) {
		try {
			const stored = typeof rows[0].config === "string" ? JSON.parse(rows[0].config) : rows[0].config;
			if (stored && typeof stored === "object") {
				config = {...config, ...stored};
			}
		} catch (error) {
			botLogsFile.error(`Config invalide pour ${id}, utilisation des valeurs par défaut :`, error);
			config = getGuildConfigDefaults();
		}
	}

	cache.set(id, config);
	return config;
}

async function setGuildConfig(guildId, changes) {
	const id = String(guildId);
	const schema = GUILD_CONFIG_SCHEMA;

	const unknownKeys = Object.keys(changes).filter((key) => !schema[key]);
	if (unknownKeys.length > 0) {
		throw new Error(`Clés de configuration inconnues : ${unknownKeys.join(", ")}`);
	}

	const current = await getGuildConfig(id);
	const merged = {...current};

	for (const [key, value] of Object.entries(changes)) {
		merged[key] = normalizeValue(key, value);
	}

	const configJson = JSON.stringify(merged);
	await executeQuery([
		`INSERT INTO guild_config (guild_id, config) VALUES (?, ?)
		 ON DUPLICATE KEY UPDATE config = VALUES(config)`,
		[id, configJson],
	]);

	cache.set(id, merged);
	return merged;
}

module.exports = {
	cache,
	getGuildConfig,
	setGuildConfig,
};
