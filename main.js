const Discord = require("discord.js")
require("dotenv").config();
const bot = new Discord.Client({intents:3276799})
const loadCommands = require("./Loaders/loadCommands")
const loadEvents = require("./Loaders/loadEvents")

bot.commands = new Discord.Collection()
bot.buttons = new Discord.Collection()
bot.color = process.env.BOT_COLOR;
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

process.on('SIGINT', () => {
    console.log('\n[!] Réception de SIGINT. Déconnexion du bot...');
    bot.destroy();
});

process.on('SIGTERM', () => {
    console.log('\n[!] Réception de SIGTERM. Déconnexion du bot...');
    bot.destroy();
});