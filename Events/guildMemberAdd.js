const Discord = require("discord.js");

module.exports = async (bot, member) => {

    const welcomeChannel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL)
    welcomeChannel.send(`Bienvenue à ${member}, il vient d'arrivée sur le serveur!`)

    const logsChannel = member.guild.channels.cache.get(process.env.LOGS_CHANNEL_GATEWAY)

    const logsNewMember = new Discord.EmbedBuilder()
        .setColor(process.env.BOT_COLOR)
        .setAuthor({name: member.displayName, iconURL: member.displayAvatarURL({dynamic : true})})
        .setDescription(`${member} a rejoint le serveur.\nUtilisateur : ${member.displayName}\n**ID** :\nUtilisateur : ${member.id}`)
        .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp()

    await logsChannel.send({ embeds: [logsNewMember] })
}