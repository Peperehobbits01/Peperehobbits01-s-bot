const Discord = require("discord.js")

module.exports = async(bot, channel) => {

    if(channel.type === Discord.ChannelType.DM) return;
    const logsChannel = "931457930660835333"

    const DeleteChannel = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setTitle(`Suppression salon par ${channel.author}`)
    .setDescription(`Name : ${channel.name}\nPermissions : ${channel.permissionsFor(channel.guild.author).toArray().join(", ")}`)
    .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

    logsChannel.send({ embeds: [DeleteChannel] })
}