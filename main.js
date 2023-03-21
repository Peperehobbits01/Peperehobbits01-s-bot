const Discord = require("discord.js")
const bot = new Discord.Client({intents:3276799})
const loadCommands = require("./Loaders/loadCommands")
const loadEvents = require("./Loaders/loadEvents")
const loadDatabase = require("./Loaders/loadDatabase")
const config = require("./Config")
const { Client, GatewayIntentBits } = require('discord.js');

global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
   disableMentions: 'everyone',
});

bot.commands = new Discord.Collection()
bot.buttons = new Discord.Collection()
bot.color = "#fcff00";
bot.function = {
    createId: require("./Fonctions/createId"),
    levenshteinDistance: require("./Fonctions/levenshteinDistance")
}

bot.login(config.token)
loadCommands(bot)
loadEvents(bot)

require(`./anti-crash.js`)();