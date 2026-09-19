const {setGuildConfig} = require("../Fonctions/guildConfig");
const botLogsFile = require("../Fonctions/botLogsFile");

module.exports = async (bot, guild) => {
	try {
		await setGuildConfig(guild.id, {});
		botLogsFile.info(`Config par défaut créée pour ${guild.name} (${guild.id}).`);
	} catch (error) {
		botLogsFile.error(`Initialisation de la config pour ${guild.id} :`, error);
	}
};
