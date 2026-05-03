const Discord = require("discord.js")

module.exports = async (bot, member) => {

    const logsChannel = process.env.LOGS_CHANNEL_MEMBER;

    const removeMember = new Discord.EmbedBuilder()
        .setColor(process.env.BOT_COLOR)
        .setTitle("Un membre a quittée le serveur")
        .setDescription(`Le membre ${member.username} , ${member.user.tag}\nID ${member.id}`)
        .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

        logsChannel.send({ embeds: [removeMember] })
}