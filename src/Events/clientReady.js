const loadSlashCommand = require("../Loaders/loadSlashCommands")
const {ActivityType} = require("discord.js")
const { processExpiredBans } = require("../Fonctions/checkTempBanUsers")

module.exports = async bot => {

	await loadSlashCommand(bot)

	bot.user.setPresence({activities: [{name: "la version 1.5.1", type: ActivityType.Watching}], status: "online"})

	console.log(`Je suis connecté à ${bot.user.tag}!`)

	await processExpiredBans(bot);

	setInterval(() => processExpiredBans(bot), 60 * 60 * 1000);
}
