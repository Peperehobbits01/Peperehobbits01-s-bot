const Discord = require("discord.js");
const ms = require("ms");

module.exports = async(bot, oldState, newState) => {

  const db = bot.db;
  const user = oldState.member.user;
  const logsChannel = "931457930660835333"
  
  if (!oldState.channel && newState.channel) {

    db.query(`INSERT INTO voicestateupdate (user, channel, time) VALUES ('${user.id}', '${newState.channel.id}', '0')`)
    console.log(`User ${user.username} has joined voice channel ${newState.channel.name}`);

    const JoinCall = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setTitle(`${user.username} à rejoint un vocal`)
    .setDescription(`**Salon**\n${oldState.channel}\n**ID**\nUtilisateur : ${user.id}\nSalon : ${oldState.channel.id}`)
    .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

    await logsChannel.send({embeds: [JoinCall]})

  } else if (oldState.channel && !newState.channel) {

    db.query(`DELETE INTO voicestateupdate WHERE channel = '${oldState.channel.id}' AND user = '${user.id}'`)
    console.log(`User ${user.username} has left voice channel ${oldState.channel.name}`);

    const LeaveCall = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setTitle(`${user.username} à quittée un vocal`)
    .setDescription(`**Salon**\n${oldState.channel}\n**ID**\nUtilisateur : ${user.id}\nSalon : ${oldState.channel.id}`)
    .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

    await logsChannel.send({embeds: [LeaveCall]})

  } else if (oldState.channel !== newState.channel) {

    db.query(`UPDATE voicestateupdate SET channel = '${newState.channel.id}', AND user = '${user.id}' AND time = '0'`)
    console.log(`User ${user.username} has switched from voice channel ${oldState.channel.name} to ${newState.channel.name}`);

    const MooveCall = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setTitle(`${user.username} à changée de vocal`)
    .setDescription(`**Salon**\n${oldState.channel} et maintenant ${newState.channel}\n**ID**\nUtilisateur : ${user.id}\nAncien salon : ${oldState.channel.id}\nNouveau salon : ${newState.channel.id}`)
    .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

    await logsChannel.send({embeds: [MooveCall]})
  }
};