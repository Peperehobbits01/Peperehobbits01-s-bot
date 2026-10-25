const {removeGuildConfigFromCache} = require("../Fonctions/guildConfig");

module.exports = async (bot, guild) => {
	removeGuildConfigFromCache(guild.id);
	bot.function.botLogsFile.info(`Configuration en cache supprimée pour le serveur quitté ${guild.id}.`);
};
