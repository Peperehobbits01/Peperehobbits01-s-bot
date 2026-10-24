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

	if (oldThread.name !== newThread.name) {
		const ThreadUpdateEmbed = new Discord.EmbedBuilder()
			.setAuthor({
				name: executor.displayName,
				iconURL: executor.displayAvatarURL({dynamic: true})
			})
			.setColor(process.env.BOT_COLOR)
			.setTitle("Le nom d'un thread a changé !")
			.setDescription(`Le nom du fil ${oldThread.name} a été changé par ${executor} en ${newThread}.`)
			.setFooter({
				text: process.env.EMBED_FOOTER,
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})

		await logsChannel.send({embeds: [ThreadUpdateEmbed]})
	}

	//TODO Add detection for the rest of the thread stuff
}
