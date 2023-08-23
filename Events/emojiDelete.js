const Discord = require("discord.js")

module.exports = async(bot) => {

    const logsChannel = "931457930660835333"

    const EmojiDelete = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setTitle("")
    .setDescription(``)
    .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

    logsChannel.send({embeds: [EmojiDelete]})
}