const Discord = require("discord.js")
const channelTypeName = require("../enum/channelTypeName")

module.exports = async (bot, channel) => {

	if (channel.type === Discord.ChannelType.DM) return;
	const logsChannel = channel.guild.channels.cache.get(process.env.LOGS_CHANNEL_CHANNEL);
	const readableChannelType = channelTypeName[channel.type];

	const fetchedLogs = await channel.guild.fetchAuditLogs({
		type: Discord.AuditLogEvent.ChannelCreate,
		limit: 5,
	});

	const channelLog = fetchedLogs.entries.find(entry =>
		entry.target?.id === channel.id
	);

	const executor = channelLog?.executor;

	const CreateChannel = new Discord.EmbedBuilder()
		.setColor(process.env.BOT_COLOR)
		.setAuthor({
			name: executor.displayName,
			iconURL: executor.displayAvatarURL({dynamic: true})
		})
		.setDescription(`Le salon ${channel} a été créer par ${executor}.\n\nNom du salon : ${channel.name}\nType de salon : ${readableChannelType}\n\n**ID** :\nSalon : \`${channel.id}\`\nUtilisateur : \`${executor.id}\``)
		.setFooter({
			text: process.env.EMBED_FOOTER,
			iconURL: bot.user.displayAvatarURL({dynamic: true})
		})
		.setTimestamp()

	await logsChannel.send({embeds: [CreateChannel]})
}
