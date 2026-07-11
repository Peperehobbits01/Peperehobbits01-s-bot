const Discord = require("discord.js")
const { getFirstImage } = require("../Fonctions/getMessageImage")

module.exports = async(bot, message, oldMessage) => {

    if(message.author.bot || message.channel.type === Discord.ChannelType.DM) return;
    if(message.partial) return;
    if(message.content === oldMessage.content) return;
    const logsChannel = message.guild.channels.cache.get(process.env.LOGS_CHANNEL_MESSAGE)
    const fetchedLogs = await message.guild.fetchAuditLogs({
        type: Discord.AuditLogEvent.messageUpdate,
        limit: 1,
    });

    const channelLog = fetchedLogs.entries.find(entry =>
        entry.target?.id === message.id || entry.target?.id === message.author.id
    );

    const executor = channelLog?.executor || message.author;

    const oldImage = getFirstImage(oldMessage)
    const newImage = getFirstImage(message)

    const messageUpdateEmbed = new Discord.EmbedBuilder()
        .setAuthor({
            name: executor.displayName,
            iconURL: executor.displayAvatarURL({dynamic: true})
        })
        .setColor(process.env.BOT_COLOR)
        .setDescription(`Un message a été modifiée par ${executor}\n\nAncien message : ${message.content}\nNouveau message : ${oldMessage.content}\nAuteur : ${oldMessage.author.displayName}\nPar : ${executor.displayName}\n\n**ID** :\nAuteur : ${message.author.id}\nPar : ${executor.id}`)
        .setFooter({
            text: "Gérée par l'instance de Peperehobbits01's Bot",
            iconURL: bot.user.displayAvatarURL({dynamic: true})
        })
        .setTimestamp()

    if (oldImage) messageUpdateEmbed.setThumbnail(oldImage)
    if (newImage) messageUpdateEmbed.setImage(newImage)

    await logsChannel.send({embeds: [messageUpdateEmbed]});
}