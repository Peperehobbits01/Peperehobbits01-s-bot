const Discord = require("discord.js")
const { channelTypeName } = require("../Fonctions/channelTypeName")

module.exports = async(bot, channel) => {

    if(channel.type === Discord.ChannelType.DM) return;
    const logsChannel = channel.guild.channels.cache.get(process.env.LOGS_CHANNEL_CHANNEL);
    const readableChannelType = channelTypeName(channel.type);

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
    .setDescription(`Le salon ${channel.name} a été supprimer par ${executor}.\n\nNom du salon : ${channel.name}\nType de salon : ${readableChannelType}\n\n**ID** :\nSalon : \`${channel.id}\`\nUtilisateur : \`${executor.id}\``)
    .setFooter({
        text: "Gérée par l'instance de Peperehobbits01's Bot",
        iconURL: bot.user.displayAvatarURL({dynamic: true})
    })
    .setTimestamp()

    await logsChannel.send({ embeds: [DeleteChannel] })
}