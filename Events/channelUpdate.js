const Discord = require('discord.js')

module.exports = async(bot, oldChannel, newChannel, guild) => {

    const logsChannel = "931457930660835333"

    if (oldChannel.guild !== newChannel.guild) {

        const UpdateChannel = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle(`Modification du salon ${oldChannel} par ${oldChannel.author}`)
        .setDescription(``)
        .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

        logsChannel.send({embeds: [UpdateChannel]})
    }
}