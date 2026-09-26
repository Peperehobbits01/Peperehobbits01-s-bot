const {executeQuery} = require("../Fonctions/databaseConnect")
const botLogsFile = require("../Fonctions/botLogsFile")

async function migrateSanctionsSystem(bot) {
	const querySanctionsSystem = `SELECT * FROM sanctions_list`
	const SanctionsSystem = await executeQuery(querySanctionsSystem)
	if (SanctionsSystem.length > 1) {
		botLogsFile.info("Le système de sanctions est déjà migré.")
		return;
	}

	const banData = await executeQuery(`SELECT * FROM ban`)
	if(banData.length > 0) {
		for (const item of banData) {
			if(item.time === null) {
				await executeQuery(`INSERT INTO sanctions_list (guildId, userID, sanction_type, sanctionID) VALUES (${item.guild}, '${item.user}', 'BAN', '${item.ban})'`)
			} else {
				await executeQuery(`INSERT INTO sanctions_list (guildId, userID, sanction_type, sanctionID) VALUES (${item.guild}, '${item.user}', 'TEMPBAN', '${item.ban}')`)
			}
		}
	}

	const kickData = await executeQuery(`SELECT * FROM kick`)
	if(kickData.length > 0) {
		for (const item of kickData) {
			await executeQuery(`INSERT INTO sanctions_list (guildId, userID, sanction_type, sanctionID) VALUES (${item.guild}, '${item.user}', 'KICK', '${item.kick}')`)
		}
	}

	const muteData = await executeQuery(`SELECT * FROM mute`)
	if(muteData.length > 0) {
		for (const item of muteData) {
			await executeQuery(`INSERT INTO sanctions_list (guildId, userID, sanction_type, sanctionID) VALUES (${item.guild}, '${item.user}', 'MUTE', '${item.mute}')`)
		}
	}

	const warnData = await executeQuery(`SELECT * FROM warn`)
	if(warnData.length > 0) {
		for (const item of warnData) {
			await executeQuery(`INSERT INTO sanctions_list (guildId, userID, sanction_type, sanctionID) VALUES (${item.guild}, '${item.user}', 'WARN', '${item.warn}')`)
		}
	}

	const notesData = await executeQuery(`SELECT * FROM note`)
	if(notesData.length > 0) {
		for (const item of notesData) {
			await executeQuery(`INSERT INTO sanctions_list (guildId, userID, sanction_type, sanctionID) VALUES (${item.guild}, '${item.user}', 'NOTE', '${item.note})'`)
		}
	}
	return botLogsFile.info("Migration accomplie avec succès !")
}

module.exports = {migrateSanctionsSystem}
