const Discord = require("discord.js")
const {getGuildConfig} = require("../Fonctions/guildConfig.js");

module.exports = async (bot, message, oldMessage) => {

	if (message.author.bot || message.channel.type === Discord.ChannelType.DM || message.partial || message.content === oldMessage.content) return;

	const config = await getGuildConfig(bot, message.guild.id);
	const logsChannel = message.guild.channels.cache.get(config.logsChannelMessage)
	if (!logsChannel) return;
	const oldImage = bot.function.getMessageImage(oldMessage)
	const newImage = bot.function.getMessageImage(message)

	const messageUpdateEmbed = new Discord.EmbedBuilder()
		.setAuthor({
			name: message.author.displayName,
			iconURL: message.author.displayAvatarURL({dynamic: true})
		})
		.setColor(process.env.BOT_COLOR)
		.setTitle("Un message a été modifier !")
		.setDescription(`${message.author.displayName} a modifié un de ces messages, en voici l'ancienne version :\n${message.content}\n\nEn voici la nouvelle version :\n${oldMessage.content}`)
		.setFooter({
			text: process.env.EMBED_FOOTER,
			iconURL: bot.user.displayAvatarURL({dynamic: true})
		})
		.setTimestamp()

	if (oldImage) messageUpdateEmbed.setThumbnail(oldImage)
	if (newImage) messageUpdateEmbed.setImage(newImage)

	await logsChannel.send({embeds: [messageUpdateEmbed]});
}
