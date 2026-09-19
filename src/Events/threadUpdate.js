const Discord = require("discord.js")
const {getGuildConfig} = require("../Fonctions/guildConfig.js")

module.exports = async (bot, oldThread, newThread) => {

	const config = await getGuildConfig(oldThread.guild.id);

	const logsChannel = config.logsChannelChannel
		? oldThread.guild.channels.cache.get(config.logsChannelChannel)
		: null;

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
			.setDescription(`Le nom du fil ${oldThread.name} a été changé par ${executor} en ${newThread.name}.\n\nAncien nom du fil : ${oldThread.name}\nNouveau nom du fil : ${newThread.name}\n\n**ID** :\nSalon : \`${oldThread.id}\`\nUtilisateur : \`${executor.id}\``)
			.setFooter({
				text: process.env.EMBED_FOOTER,
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})

		if (logsChannel) {
			await logsChannel.send({embeds: [ThreadUpdateEmbed]})
		}
	}
}
