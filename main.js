const Discord = require("discord.js")
require("dotenv").config();
const bot = new Discord.Client({intents: 3276799})
const loadCommands = require("./src/Loaders/loadCommands")
const loadEvents = require("./src/Loaders/loadEvents")

bot.commands = new Discord.Collection()
bot.buttons = new Discord.Collection()
bot.function = {
	processExpiredBans: require("./src/Fonctions/checkTempBanUsers"),
	createId: require("./src/Fonctions/createId.js"),
	levenshteinDistance: require("./src/Fonctions/levenshteinDistance.js"),
	databaseConnect: require("./src/Fonctions/databaseConnect.js"),
	getMessageImage: require("./src/Fonctions/getMessageImage.js"),
	shuffleArray: require("./src/Fonctions/shuffleArray.js"),
	voiceCallXpCalculation: require("./src/Fonctions/voiceCallXpCalculation.js"),
}

bot.login(process.env.TOKEN).then(() =>
	loadCommands(bot, process.cwd() + '/src/Commandes'),
	loadEvents(bot)
)

process.on('SIGINT', () => {
	console.log('\n[!] Réception de SIGINT. Déconnexion du bot...');
	bot.destroy().then(r => console.log('\n[!] Réception de SIGINT. Déconnexion du bot réussie.'));
});

process.on('SIGTERM', () => {
	console.log('\n[!] Réception de SIGTERM. Déconnexion du bot...');
	bot.destroy().then(r => console.log('\n[!] Réception de SIGTERM. Déconnexion du bot réussie.'));
});
