const Discord = require("discord.js")

module.exports = async(bot, channel) => {

    if(channel.type === Discord.ChannelType.DM) return;
    const logsChannel = "931457930660835333"

    const CreateChannel = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setTitle(`Nouveau salon par ${channel.author}`)
    .setDescription(`Nom : ${channel.name}\nID :\nUtilisateur : ${channel.author.id}\nSalon : ${channel.id}`)
    .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

    logsChannel.send({ embeds: [CreateChannel] })
}