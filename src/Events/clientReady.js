const loadSlashCommand = require("../Loaders/loadSlashCommands")
const {ActivityType} = require("discord.js")
const botLogsFile = require("../Fonctions/botLogsFile")

module.exports = async bot => {

	await loadSlashCommand(bot)

	bot.user.setPresence({activities: [{name: "la version 1.7.1", type: ActivityType.Watching}], status: "online"})

	botLogsFile.info(`Je suis connecté à ${bot.user.tag}!`)

	await bot.function.processExpiredBans(bot).then(() =>
		setInterval(() => bot.function.processExpiredBans(bot), 60 * 60 * 1000)
	)

	await bot.function.checkAllYouTubeChannels(bot).then(() =>
	setInterval(() => bot.function.checkAllYouTubeChannels(bot), 5 * 60 * 1000))
}
