const Discord = require("discord.js")

module.exports = async (bot, oldThread, newThread) => {

	const logsChannel = oldThread.guild.channels.cache.get(process.env.LOGS_CHANNEL_CHANNEL);

	const fetchedLogs = await oldThread.guild.fetchAuditLogs({
		type: Discord.AuditLogEvent.ThreadUpdate,
		limit: 5,
	});

	const channelLog = fetchedLogs.entries.find(entry =>
		entry.target?.id === oldThread.id && Date.now() - entry.createdTimestamp < 5000
	);

	const executor = channelLog?.executor;

	if (oldThread.name !== newThread.name) {
		const ThreadUpdateEmbed = new Discord.EmbedBuilder()
			.setAuthor({
				name: executor.displayName,
				iconURL: executor.displayAvatarURL({dynamic: true})
			})
			.setColor(process.env.BOT_COLOR)
			.setDescription(`Le nom du fil ${oldThread.name} a été changer par ${executor} en ${newThread.name}\n\nAncien nom du fil : ${oldThread.name}\nNouveau nom du fil : ${newThread.name}\n\n**ID** :\nSalon : \`${oldThread.id}\`\nUtilisateur : \`${executor.id}\``)
			.setFooter({
				text: "Gérée par l'instance de Peperehobbits01's Bot",
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})

		await logsChannel.send({embeds: [ThreadUpdateEmbed]})
	}
}
