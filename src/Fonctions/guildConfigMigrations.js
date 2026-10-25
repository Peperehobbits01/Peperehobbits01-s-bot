const CURRENT_VERSION = 1;
const MIGRATIONS = [
	{
		from: 0,
		to: CURRENT_VERSION,
		up(stored) {
			if (stored && typeof stored === "object") {
				delete stored.momRole;
			}
			return stored;
		},
	},
];

function findMigration(from) {
	return MIGRATIONS.find((m) => m.from === from);
}

function migrateStored(stored, fromVersion) {
	let version = fromVersion;
	let value = stored;

	while (version < CURRENT_VERSION) {
		const migration = findMigration(version);
		if (!migration) {
			throw new Error(`Migration inconnue vers la version ${version} (attendue: ${CURRENT_VERSION}, trouvée: ${fromVersion}).`);
		}
		value = migration.up(value) ?? value;
		version = migration.to;
	}

	return {value, version};
}

function parseStored(raw) {
	if (raw == null) return {};
	const stored = typeof raw === "string" ? JSON.parse(raw) : raw;
	if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
		throw new Error("La configuration stockée doit être un objet JSON.");
	}
	return stored;
}

async function migrateGuildConfigRow(guildId, rawConfig, fromVersion, bot) {
	const stored = parseStored(rawConfig);
	const {value, version} = migrateStored(stored, fromVersion);

	const result = await bot.function.executeQuery([
		"UPDATE guild_config SET config = ?, version = ? WHERE guild_id = ?",
		[JSON.stringify(value), version, String(guildId)],
	], bot);
	if (!result || typeof result !== "object" || !Number.isFinite(result.affectedRows) || result.affectedRows < 1) {
		throw new Error(`Résultat invalide lors de la migration de la config pour ${guildId}.`);
	}
}

async function migrateAllGuildConfigs(bot) {
	const rows = await bot.function.executeQuery([
		"SELECT guild_id, config, version FROM guild_config WHERE version < ?",
		[CURRENT_VERSION],
	], bot);
	if (!Array.isArray(rows)) {
		throw new Error("La requête de lecture des configs à migrer n'a pas retourné une liste de lignes.");
	}

	if (rows.length === 0) return {migrated: 0, failed: 0};

	let migrated = 0;
	let failed = 0;

	for (const row of rows) {
		try {
			const fromVersion = Number(row.version);
			if (!Number.isSafeInteger(fromVersion) || fromVersion < 0) {
				throw new Error(`Version de configuration invalide : ${row.version}.`);
			}
			await migrateGuildConfigRow(row.guild_id, row.config, fromVersion, bot);
			migrated += 1;
		} catch (error) {
			failed += 1;
			bot.function.botLogsFile.error(`Migration de la config pour ${row.guild_id} (v${row.version} → v${CURRENT_VERSION}) :`, error);
		}
	}

	bot.function.botLogsFile.info(`Migration des configs guild terminée : ${migrated} mise(s) à jour, ${failed} échec(s) → v${CURRENT_VERSION}.`);
	if (failed > 0) {
		throw new Error(`${failed} configuration(s) n'ont pas pu être migrées. La mise en ligne est interrompue.`);
	}
	return {migrated, failed};
}

module.exports = {
	CURRENT_VERSION,
	MIGRATIONS,
	migrateAllGuildConfigs,
};
