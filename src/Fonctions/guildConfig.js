const {DEFAULT_GUILD_CONFIG, GUILD_CONFIG_SCHEMA} = require("../Enum/defaultGuildConfig");
const {CURRENT_VERSION} = require("./guildConfigMigrations");

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map();
const cacheExpiresAt = new Map();

function cloneConfig(config) {
	return Object.fromEntries(Object.entries(config).map(([key, value]) => [
		key,
		Array.isArray(value) ? [...value] : value,
	]));
}

function validationError(message) {
	const error = new Error(message);
	error.code = "INVALID_GUILD_CONFIG";
	return error;
}

function normalizeValue(key, value) {
	const field = GUILD_CONFIG_SCHEMA[key];
	if (!field) {
		throw validationError(`Paramètre de configuration inconnu : ${key}.`);
	}

	if (value === undefined || value === null || value === "") {
		return field.type === "list" ? [] : null;
	}

	if (field.type === "snowflake") {
		const snowflake = String(value).trim();
		if (!/^\d{17,20}$/.test(snowflake)) {
			throw validationError(`\`${key}\` doit être un identifiant Discord valide.`);
		}
		return snowflake;
	}

	if (field.type === "list") {
		const values = Array.isArray(value) ? value : String(value).split(/[,\s]+/);
		const normalized = values.map((item) => String(item).trim()).filter(Boolean);
		const invalid = normalized.find((item) => !field.itemPattern?.test(item));
		if (invalid) {
			throw validationError(`Valeur invalide pour \`${key}\` : \`${invalid}\` (format attendu : ${field.itemDescription}).`);
		}
		return [...new Set(normalized.map((item) => field.lowercase ? item.toLowerCase() : item))];
	}

	throw validationError(`Type de configuration non pris en charge pour \`${key}\`.`);
}

async function getGuildConfig(bot, guildId) {
	const id = String(guildId);
	if (cache.has(id) && Date.now() < cacheExpiresAt.get(id)) {
		return cloneConfig(cache.get(id));
	}
	cache.delete(id);
	cacheExpiresAt.delete(id);

	const rows = await bot.function.executeQuery(["SELECT config FROM guild_config WHERE guild_id = ?", [id]], bot);
	if (!Array.isArray(rows)) {
		throw new Error(`La lecture de la configuration du serveur ${id} a échoué.`);
	}

	let config = cloneConfig(DEFAULT_GUILD_CONFIG);

	if (rows.length > 0) {
		try {
			const stored = typeof rows[0].config === "string" ? JSON.parse(rows[0].config) : rows[0].config;
			if (stored && typeof stored === "object" && !Array.isArray(stored)) {
				config = {...config, ...stored};
			}
		} catch (error) {
			bot.function.botLogsFile.error(`Config invalide pour ${id}, utilisation des valeurs par défaut :`, error);
			config = cloneConfig(DEFAULT_GUILD_CONFIG);
		}
	}

	cache.set(id, config);
	cacheExpiresAt.set(id, Date.now() + CACHE_TTL_MS);
	return cloneConfig(config);
}

async function setGuildConfig(bot, guildId, changes) {
	const id = String(guildId);
	const current = await getGuildConfig(bot, id);
	const merged = cloneConfig(current);

	for (const [key, value] of Object.entries(changes)) {
		merged[key] = normalizeValue(key, value);
	}

	const configJson = JSON.stringify(merged);
	const result = await bot.function.executeQuery([
		`INSERT INTO guild_config (guild_id, config, version) VALUES (?, ?, ?)
		 ON DUPLICATE KEY UPDATE config = VALUES(config), version = VALUES(version)`,
		[id, configJson, CURRENT_VERSION],
	], bot);
	if (result === undefined) {
		throw new Error(`L'enregistrement de la configuration du serveur ${id} a échoué.`);
	}

	cache.set(id, merged);
	cacheExpiresAt.set(id, Date.now() + CACHE_TTL_MS);
	return cloneConfig(merged);
}

function removeGuildConfigFromCache(guildId) {
	const id = String(guildId);
	cache.delete(id);
	cacheExpiresAt.delete(id);
}

module.exports = {
	cache,
	getGuildConfig,
	removeGuildConfigFromCache,
	setGuildConfig,
};
