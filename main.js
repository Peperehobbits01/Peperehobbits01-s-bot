const Discord = require("discord.js")
require("dotenv").config();
const bot = new Discord.Client({intents:3276799})
const loadCommands = require("./Loaders/loadCommands")
const loadEvents = require("./Loaders/loadEvents")

bot.commands = new Discord.Collection()
bot.buttons = new Discord.Collection()
bot.color = "#fcff00";
bot.function = {
    createId: require("./Fonctions/createId.js"),
    levenshteinDistance: require("./Fonctions/levenshteinDistance.js"),
    databaseConnect : require("./Fonctions/databaseConnect.js"),
    calculXp : require("./Fonctions/calculXp.js"),
}

bot.login(process.env.TOKEN)
loadCommands(bot, process.cwd() + '/Commandes');
loadEvents(bot)

require(`./anti-crash.js`)();