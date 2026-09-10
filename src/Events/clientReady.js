const loadSlashCommand = require("../Loaders/loadSlashCommands")
const {ActivityType} = require("discord.js")
const { processExpiredBans } = require("../Fonctions/checkTempBanUsers")
const botLogsFile = require("../Fonctions/botLogsFile")

module.exports = async bot => {

	await loadSlashCommand(bot)

	bot.user.setPresence({activities: [{name: "la version 1.6.2", type: ActivityType.Watching}], status: "online"})

	botLogsFile.info(`Je suis connecté à ${bot.user.tag}!`)

	await processExpiredBans(bot);

	setInterval(() => processExpiredBans(bot), 60 * 60 * 1000);
}
