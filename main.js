const Discord = require("discord.js")
require("dotenv").config({ quiet: true });
const bot = new Discord.Client({intents: 3276799})
const loadCommands = require("./src/Loaders/loadCommands")
const loadEvents = require("./src/Loaders/loadEvents")
const os = require("node:os");

bot.commands = new Discord.Collection()
bot.buttons = new Discord.Collection()
bot.function = {
	botLogsFile: require("./src/Fonctions/botLogsFile"),
	processExpiredBans: require("./src/Fonctions/checkTempBanUsers"),
	createId: require("./src/Fonctions/createId.js"),
	levenshteinDistance: require("./src/Fonctions/levenshteinDistance.js"),
	databaseConnect: require("./src/Fonctions/databaseConnect.js"),
	getMessageImage: require("./src/Fonctions/getMessageImage.js"),
	shuffleArray: require("./src/Fonctions/shuffleArray.js"),
	voiceCallXpCalculation: require("./src/Fonctions/voiceCallXpCalculation.js"),
}

const botLogsFile = require("./src/Fonctions/botLogsFile.js");

botLogsFile.info(`Tourne sur ${os.type()} ${os.release()} sur l'architecture : ${os.arch()}.`)

bot.login(process.env.TOKEN).then(() =>
	loadCommands(bot, process.cwd() + '/src/Commandes'),
	loadEvents(bot)
)

process.on("unhandledRejection", (reason) => {
	botLogsFile.error("Unhandled promise rejection", reason);
});

process.on("uncaughtException", (error) => {
	botLogsFile.error("Uncaught exception", error);
	process.exit(1);
});

process.on('SIGINT', () => {
	botLogsFile.info('\n[!] Réception de SIGINT. Déconnexion du bot...');
	bot.destroy().then(() => botLogsFile.info('\n[!] Réception de SIGINT. Déconnexion du bot réussie.'));
	process.exit(0);
});

process.on('SIGTERM', () => {
	botLogsFile.info('\n[!] Réception de SIGTERM. Déconnexion du bot...');
	bot.destroy().then(() => botLogsFile.info('\n[!] Réception de SIGTERM. Déconnexion du bot réussie.'));
	process.exit(1);
});
