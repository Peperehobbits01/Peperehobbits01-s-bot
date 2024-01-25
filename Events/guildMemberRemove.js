const Discord = require("discord.js")

module.exports = async (bot, user) => {

    const logsChannel = "931457930660835333"

    const removeMember = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle("Un membre a quittée le serveur")
        .setDescription(`Le membre ${user.username} , ${user.tag}\nID ${user.id}`)
        .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

        logsChannel.send({ embeds: [removeMember] })
}