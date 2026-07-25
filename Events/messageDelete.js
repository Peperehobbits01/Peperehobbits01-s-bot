const Discord = require("discord.js")
const {getFirstImage} = require("../Fonctions/getMessageImage")
const {executeQuery} = require("../Fonctions/databaseConnect");

module.exports = async (bot, message) => {

	if(message.partial || message.channel.type === Discord.ChannelType.DM) return;
	if(message.author.bot) {
		if(message.components?.[0].components.find(c => c.customId.startsWith("giveaway_"))) {
			const giveawayID = message.components?.[0].components.find(c => c.customId.startsWith("giveaway_")).customId.split("_")[1];
			const giveawayCancel = `DELETE FROM giveaway WHERE guild = '${message.guild.id}' AND ID = '${giveawayID}'`
			await executeQuery(giveawayCancel)
			return;
		} else {
			return;
		}
	}

	const logsChannel = message.guild.channels.cache.get(process.env.LOGS_CHANNEL_MESSAGE);
	const fetchedLogs = await message.guild.fetchAuditLogs({
		type: Discord.AuditLogEvent.messageDelete,
		limit: 1,
	});

	const channelLog = fetchedLogs.entries.find(entry =>
		entry.target?.id === message.id || entry.target?.id === message.author.id
	);

	const executor = channelLog?.executor || message.author;

	const deletedImage = getFirstImage(message)

	const MessageRemoveEmbed = new Discord.EmbedBuilder()
		.setAuthor({
			name: executor.displayName,
			iconURL: executor.displayAvatarURL({dynamic: true})
		})
		.setColor(process.env.BOT_COLOR)
		.setDescription(`Un message de ${message.author} a été supprimer par ${executor}\n\nMessage supprimer : ${message}\nAuteur : ${message.author.displayName}\nPar : ${executor.displayName}\n\n**ID** :\nAuteur : ${message.author.id}\nPar : ${executor.id}`)
		.setFooter({
			text: "Gérée par l'instance de Peperehobbits01's Bot",
			iconURL: bot.user.displayAvatarURL({dynamic: true})
		})
		.setTimestamp()


	if (deletedImage) {
		MessageRemoveEmbed.setImage(deletedImage)
	}

	await logsChannel.send({embeds: [MessageRemoveEmbed]})
}
