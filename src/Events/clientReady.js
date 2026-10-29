const loadSlashCommand = require("../Loaders/loadSlashCommands")
const {ActivityType} = require("discord.js")
const {CURRENT_VERSION, migrateAllGuildConfigs} = require("../Fonctions/guildConfigMigrations");

module.exports = async bot => {
	let result;
	try {
		result = await migrateAllGuildConfigs(bot);
	} catch (error) {
		bot.function.botLogsFile.error("Échec des migrations de configuration :", error);
	}

	if (result.migrated === 0) {
		bot.function.botLogsFile.info(`Aucune ligne à migrer de la v0 → v${CURRENT_VERSION}.`);
	} else {
		bot.function.botLogsFile.info(`Terminé : ${result.migrated} mise(s) à jour, ${result.failed} échec(s).`);
	}

	await loadSlashCommand(bot)

	bot.user.setPresence({activities: [{name: "la version 1.8.2", type: ActivityType.Watching}], status: "online"})

	bot.function.botLogsFile.info(`Je suis connecté à ${bot.user.tag}!`)

	await bot.function.processExpiredBans(bot).then(() =>
		setInterval(() => bot.function.processExpiredBans(bot).catch((error) => bot.function.botLogsFile.error("La détection des débanissements a échoué :", error)), 60 * 60 * 1000)
	).catch((error) =>
		bot.function.botLogsFile.error("La détection des débanissements a échoué :", error),
	);

	await bot.function.checkAllYouTubeChannels(bot).then(() =>
		setInterval(() => bot.function.checkAllYouTubeChannels(bot).catch((error) => bot.function.botLogsFile.error("La détection YouTube a échoué :", error)), 5 * 60 * 1000)
	).catch((error) =>
		bot.function.botLogsFile.error("La détection YouTube a échoué :", error),
	);

	await bot.function.checkAllTwitchChannels(bot).then(() =>
		setInterval(() => bot.function.checkAllTwitchChannels(bot).catch((error) => bot.function.botLogsFile.error("La détection Twitch a échoué :", error)), 5 * 60 * 1000)
	).catch((error) =>
		bot.function.botLogsFile.error("La détection Twitch a échoué :", error),
	);
}
