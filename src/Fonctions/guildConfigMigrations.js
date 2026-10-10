const {executeQuery} = require("./databaseConnect");
const botLogsFile = require("./botLogsFile");

const CURRENT_VERSION = 1;

const MIGRATIONS = [
	{
		from: 0,
		to: 1,
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
	if (typeof raw === "object") return raw;
	return JSON.parse(raw);
}

async function migrateGuildConfigRow(guildId, rawConfig, fromVersion) {
	const stored = parseStored(rawConfig);
	const {value, version} = migrateStored(stored, fromVersion);

	return await executeQuery([
		"UPDATE guild_config SET config = ?, version = ? WHERE guild_id = ?",
		[JSON.stringify(value), version, String(guildId)],
	]);
}

async function migrateAllGuildConfigs() {
	let rows;
	try {
		rows = await executeQuery([
			"SELECT guild_id, config, version FROM guild_config WHERE version < ?",
			[CURRENT_VERSION],
		]);
	} catch (error) {
		botLogsFile.error("Erreur de lecture des lignes à migrer : ", error);
		return 0;
	}

	if (!rows || rows.length === 0) {
		return 0;
	}

	let migrated = 0;
	let failed = 0;

	for (const row of rows) {
		try {
			const fromVersion = Number(row.version) || 0;
			await migrateGuildConfigRow(row.guild_id, row.config, fromVersion);
			migrated += 1;
		} catch (error) {
			failed += 1;
			botLogsFile.error(`Migration de la config pour ${row.guild_id} (v${row.version} → v${CURRENT_VERSION}) :`, error);
		}
	}

	botLogsFile.info(`Migration des configs guild terminée : ${migrated} mise(s) à jour, ${failed} échec(s) → v${CURRENT_VERSION}.`);
	return {migrated, failed};
}

module.exports = {
	CURRENT_VERSION,
	MIGRATIONS,
	migrateAllGuildConfigs,
};
