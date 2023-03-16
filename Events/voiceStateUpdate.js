const Discord = require("discord.js");
const time = require("ms");

module.exports = async(bot, oldState, newState, db) => {

  const user = oldState.member.user;
  
  if (!oldState.channel && newState.channel) {

    db.query(`INSERT INTO voicestateupdate (guild, user, channel, time) VALUES (${newState.channel.guildId}, '${user.id}', '${newState.channel.id}', '0')`)
    console.log(`User ${user.username} has joined voice channel ${newState.channel.name}`);

    const embed = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setTitle(`${user.username} à rejoint un vocal`)
    .setDescription(`**Salon**\n${oldState.channel}\n**ID**\nUtilisateur = ${user.id}\nSalon = ${oldState.channel.id}`)
    .setFooter({text: "Peperehobbits01's bot instance"})
    
    let logschannel = newState.guild.channels.cache.get('931457930660835333');
    await logschannel.send({embeds: [embed]})

  } else if (oldState.channel && !newState.channel) {

    db.query(`DELETE INTO voicestateupdate WHERE guild = ${oldState.channel.guildId} AND user = ${user.id}`)
    console.log(`User ${user.username} has left voice channel ${oldState.channel.name}`);

    const embed = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setTitle(`${user.username} à quittée un vocal`)
    .setDescription(`**Salon**\n${oldState.channel}\n**ID**\nUtilisateur = ${user.id}\nSalon = ${oldState.channel.id}`)
    .setFooter({text: "Peperehobbits01's bot instance"})
    
    let logschannel = newState.guild.channels.cache.get('931457930660835333');
    await logschannel.send({embeds: [embed]})

  } else if (oldState.channel !== newState.channel) {

    db.query(`UPDATE voicestateupdate SET channel = '${newState.channel.id}' WHERE guild = ${newState.channel.guildId}, AND user = '${user.id}' AND time = '0'`)
    console.log(`User ${user.username} has switched from voice channel ${oldState.channel.name} to ${newState.channel.name}`);

    const embed = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setTitle(`${user.username} à changée de vocal`)
    .setDescription(`**Salon**\n${oldState.channel} et maintenant ${newState.channel}\n**ID**\nUtilisateur = ${user.id}\nAncien salon = ${oldState.channel.id}\nNouveau salon = ${newState.channel.id}`)
    .setFooter({text: "Peperehobbits01's bot instance"})
    
    let logschannel = newState.guild.channels.cache.get('931457930660835333');
    await logschannel.send({embeds: [embed]})
  }
};