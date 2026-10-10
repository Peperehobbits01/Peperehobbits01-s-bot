const loadSlashCommand = require("../Loaders/loadSlashCommands")
const {ActivityType} = require("discord.js")
const botLogsFile = require("../Fonctions/botLogsFile")
const {CURRENT_VERSION, migrateAllGuildConfigs} = require("../Fonctions/guildConfigMigrations");

module.exports = async bot => {

	const result = await migrateAllGuildConfigs();

	if (typeof result === "number") {
		botLogsFile.info(`Aucune ligne à migrer de la v0 → v${CURRENT_VERSION}.`);
	} else {
		botLogsFile.info(`Terminé : ${result.migrated} mise(s) à jour, ${result.failed} échec(s).`);
	}

	await loadSlashCommand(bot)

	bot.user.setPresence({activities: [{name: "la version 1.7.1", type: ActivityType.Watching}], status: "online"})

	botLogsFile.info(`Je suis connecté à ${bot.user.tag}!`)

	await bot.function.processExpiredBans(bot).then(() =>
		setInterval(() => bot.function.processExpiredBans(bot), 60 * 60 * 1000)
	)

	await bot.function.checkAllYouTubeChannels(bot).then(() =>
	setInterval(() => bot.function.checkAllYouTubeChannels(bot), 5 * 60 * 1000))
}
