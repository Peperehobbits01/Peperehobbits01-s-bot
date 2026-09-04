const Discord = require("discord.js")
const {getFirstImage} = require("../Fonctions/getMessageImage")

module.exports = async (bot, message, oldMessage) => {

	if (message.author.bot || message.channel.type === Discord.ChannelType.DM || message.partial || message.content === oldMessage.content) return;
	const logsChannel = message.guild.channels.cache.get(process.env.LOGS_CHANNEL_MESSAGE)

	const oldImage = getFirstImage(oldMessage)
	const newImage = getFirstImage(message)

	const messageUpdateEmbed = new Discord.EmbedBuilder()
		.setAuthor({
			name: message.author.displayName,
			iconURL: message.author.displayAvatarURL({dynamic: true})
		})
		.setColor(process.env.BOT_COLOR)
		.setDescription(`${message.author.displayName} a modifié un de ces messages.\n\nAncien message : ${message.content}\nNouveau message : ${oldMessage.content}\nAuteur : ${oldMessage.author.displayName}\n\n**ID** :\nAuteur : ${message.author.id}`)
		.setFooter({
			text: process.env.EMBED_FOOTER,
			iconURL: bot.user.displayAvatarURL({dynamic: true})
		})
		.setTimestamp()

	if (oldImage) messageUpdateEmbed.setThumbnail(oldImage)
	if (newImage) messageUpdateEmbed.setImage(newImage)

	await logsChannel.send({embeds: [messageUpdateEmbed]});
}
