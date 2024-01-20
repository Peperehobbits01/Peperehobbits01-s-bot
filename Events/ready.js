const Discord = require('discord.js')
const loadSlashCommand = require("../Loaders/loadSlashCommands")
const { ActivityType } = require("discord.js")

module.exports = async bot => {

    await loadSlashCommand(bot)

    bot.user.setPresence({activities: [{name: "la version 1.4.0 béta",type: ActivityType.Watching}],status:"online"})

    console.log(`Je suis connecté à ${bot.user.tag}!`)
}