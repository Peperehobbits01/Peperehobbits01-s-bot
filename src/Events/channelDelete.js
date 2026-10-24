const Discord = require("discord.js")
const channelTypeName = require("../Enum/channelTypeName")
const {getGuildConfig} = require("../Fonctions/guildConfig.js")

module.exports = async (bot, channel) => {

	if (channel.type === Discord.ChannelType.DM) return;
	const config = await getGuildConfig(bot, channel.guild.id);
	const logsChannel = channel.guild.channels.cache.get(config.logsChannelChannel)
	if (!logsChannel) return;
	const readableChannelType = channelTypeName[channel.type];

	const fetchedLogs = await channel.guild.fetchAuditLogs({
		type: Discord.AuditLogEvent.ChannelDelete,
		limit: 5,
	});

	const channelLog = fetchedLogs.entries.find(entry =>
		entry.target?.id === channel.id
	);

	const executor = channelLog?.executor;

	const DeleteChannel = new Discord.EmbedBuilder()
		.setColor(process.env.BOT_COLOR)
		.setAuthor({
			name: executor.displayName,
			iconURL: executor.displayAvatarURL({dynamic: true})
		})
		.setTitle("Un salon a été supprimé.")
		.setDescription(`Le salon ${readableChannelType} ${channel.name} a été supprimé par ${executor}.`)
		.setFooter({
			text: process.env.EMBED_FOOTER,
			iconURL: bot.user.displayAvatarURL({dynamic: true})
		})
		.setTimestamp()

	await logsChannel.send({embeds: [DeleteChannel]})
}
