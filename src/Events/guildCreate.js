const {setGuildConfig} = require("../Fonctions/guildConfig");

module.exports = async (bot, guild) => {
	try {
		await setGuildConfig(bot, guild.id, {});
		bot.function.botLogsFile.info(`Config par défaut créée pour ${guild.name} (${guild.id}).`);
	} catch (error) {
		bot.function.botLogsFile.error(`Initialisation de la config pour ${guild.id} :`, error);
	}
};
