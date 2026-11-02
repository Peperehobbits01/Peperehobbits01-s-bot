const Discord = require("discord.js")
const {getGuildConfig} = require("../Fonctions/guildConfig.js")

module.exports = async (bot, oldThread, newThread) => {

	const config = await getGuildConfig(bot, oldThread.guild.id);
	const logsChannel = oldThread.guild.channels.cache.get(config.logsChannelChannel)
	if (!logsChannel) return;
	const fetchedLogs = await oldThread.guild.fetchAuditLogs({
		type: Discord.AuditLogEvent.ThreadUpdate,
		limit: 5,
	});

	const channelLog = fetchedLogs.entries.find(entry =>
		entry.target?.id === oldThread.id && Date.now() - entry.createdTimestamp < 5000
	);

	const executor = channelLog?.executor;

	const ThreadUpdateEmbed = new Discord.EmbedBuilder()
		.setAuthor({
			name: executor.displayName,
			iconURL: executor.displayAvatarURL({dynamic: true})
		})
		.setColor(process.env.BOT_COLOR)
		.setFooter({
			text: process.env.EMBED_FOOTER,
			iconURL: bot.user.displayAvatarURL({dynamic: true})
		})

	if (oldThread.name !== newThread.name) {

			ThreadUpdateEmbed.setTitle("Le nom d'un thread a changé !")
			ThreadUpdateEmbed.setDescription(`Le nom du fil ${oldThread.name} a été changé par ${executor} en ${newThread}.`)

		await logsChannel.send({embeds: [ThreadUpdateEmbed]})
	}

	if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
		if (oldThread.rateLimitPerUser === 0 && newThread.rateLimitPerUser > 0) {
			const duration = bot.function.secondsToHms(newThread.rateLimitPerUser);

			ThreadUpdateEmbed.setTitle("Un thread vient d'être soumis au mode lent.")
			ThreadUpdateEmbed.setDescription(`Le thread ${oldThread} vient d'être soumis au mode lent de ${duration} par ${executor}.`)

			await logsChannel.send({embeds: [ThreadUpdateEmbed]})
		} else if (oldThread.rateLimitPerUser > 0 && newThread.rateLimitPerUser === 0) {
			const duration = bot.function.secondsToHms(oldThread.rateLimitPerUser);

			ThreadUpdateEmbed.setTitle("Un thread n'est plus soumis au mode lent.")
			ThreadUpdateEmbed.setDescription(`Le thread ${oldThread} n'est plus soumis au mode lent de ${duration} par ${executor}.`)

			await logsChannel.send({embeds: [ThreadUpdateEmbed]})
		} else if (oldThread.rateLimitPerUser > 0 && newThread.rateLimitPerUser > 0) {
			const oldDuration = bot.function.secondsToHms(oldThread.rateLimitPerUser);
			const newDuration = bot.function.secondsToHms(newThread.rateLimitPerUser);

			ThreadUpdateEmbed.setTitle("La durée du mode lent a été changé dans un thread.")
			ThreadUpdateEmbed.setDescription(`Le thread ${oldThread} a un changement de la durée du mode lent de ${oldDuration} à ${newDuration} par ${executor}.`)

			await logsChannel.send({embeds: [ThreadUpdateEmbed]})
		}
	}
}
