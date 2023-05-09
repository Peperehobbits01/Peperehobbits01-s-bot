const Discord = require("discord.js");
const Canvas = require("canvas");

module.exports = async (bot, member, guild) => {

    if(member.guild.id !== ("931457929431908373")) return;
    bot.channels.cache.get("931457930325270614").send(`Bienvenue à <@${member.id}>, il vient d'arrivée sur le serveur!`)
    let role = "931457929431908376"
    await member.roles.add(role)

    const WelcomeChannel = "931457930325270614"

    const WelcomeImage = await new Canvas.Welcome()
    .setUsername(member.user.username)
    .setDiscriminator(member.user.discriminator)
    .setGuildName(member.guild.name)
    .setAvatar(member.user.displayAvatarURL({ dynamic: true }))
    .setColor("border", bot.color)
    .setColor("username-box", "#DAAB3A")
    .setColor("discriminator-box", "#FFFF00")
    .setColor("message-box", "#B67332")
    .setColor("title", "B67332")
    .setColor("avatar", bot.color)
    .setBackgroundColor()
    .toAttachment();

    const attachment = new Discord.Attachment(WelcomeImage.toBuffer(), "welcome-image.png");

    message.WelcomeChannel.send(attachment);

    const logsChannel = "931457930660835333"

    const logsNewMember = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setTitle("Nouveau membre sur le serveur")
    .setDescription(`${member.user.tag} a rejoint le serveur.`)
    .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

    logsChannel.send({ embeds: [logsNewMember] })
}