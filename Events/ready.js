const Discord = require('discord.js')
const loadDatabase = require("../Loaders/loadDatabase")
const loadSlashCommand = require("../Loaders/loadSlashCommands")
const { ActivityType } = require("discord.js")

module.exports = async bot => {

    bot.db = await loadDatabase()
    bot.db.connect(function () {
        console.log(`Je suis connectée à la base de donnée!`)
    })

    await loadSlashCommand(bot)

    bot.user.setPresence({activities: [{name: "la version 1.3.3",type: ActivityType.Watching}],status:"online"})

    console.log(`Je suis connecté à ${bot.user.tag}!`)
}