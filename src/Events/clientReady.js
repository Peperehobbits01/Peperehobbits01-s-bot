const loadSlashCommand = require("../Loaders/loadSlashCommands")
const {ActivityType} = require("discord.js")
const botLogsFile = require("../Fonctions/botLogsFile")
const {migrateEnvToGuildConfig} = require("../Fonctions/migrateEnvToGuildConfig")
const fs = require("node:fs");
const path = require("node:path");
const cacheDir = path.join(__dirname, "../../cache")
const cacheFolderExists = fs.existsSync(cacheDir)

module.exports = async bot => {

	await migrateEnvToGuildConfig(bot)

	await loadSlashCommand(bot)
	if(cacheFolderExists === false) {
		fs.mkdirSync(cacheDir, { recursive: true })
		botLogsFile.info("Création du dossier de cache réussi !")
	}

	bot.user.setPresence({activities: [{name: "la version 1.6.2", type: ActivityType.Watching}], status: "online"})

	botLogsFile.info(`Je suis connecté à ${bot.user.tag}!`)

	await bot.function.processExpiredBans(bot).then(() =>
		setInterval(() => bot.function.processExpiredBans(bot), 60 * 60 * 1000)
	)

	await bot.function.checkAllYouTubeChannels(bot).then(() =>
	setInterval(() => bot.function.checkAllYouTubeChannels(bot), 5 * 60 * 1000))
}
