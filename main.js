const Discord = require("discord.js")
require("dotenv").config();
const bot = new Discord.Client({intents:3276799})
const loadCommands = require("./Loaders/loadCommands")
const loadEvents = require("./Loaders/loadEvents")

bot.commands = new Discord.Collection()
bot.buttons = new Discord.Collection()
bot.function = {
    createId: require("./Fonctions/createId.js"),
    levenshteinDistance: require("./Fonctions/levenshteinDistance.js"),
    databaseConnect : require("./Fonctions/databaseConnect.js"),
    calculXp : require("./Fonctions/calculXp.js"),
    channelTypeName : require("./Fonctions/channelTypeName.js"),
}

bot.login(process.env.TOKEN)
loadCommands(bot, process.cwd() + '/Commandes');
loadEvents(bot)

require(`./anti-crash.js`)();

process.on('SIGINT', () => {
    console.log('\n[!] Réception de SIGINT. Déconnexion du bot...');
    bot.destroy().then(r => console.log('\n[!] Réception de SIGINT. Déconnexion du bot réussie.'));
});

process.on('SIGTERM', () => {
    console.log('\n[!] Réception de SIGTERM. Déconnexion du bot...');
    bot.destroy().then(r => console.log('\n[!] Réception de SIGTERM. Déconnexion du bot réussie.'));
});