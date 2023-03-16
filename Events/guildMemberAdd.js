const Discord = require("discord.js");

module.exports = async (bot, member, guild) => {

    if(member.guild.id !== ("931457929431908373")) return;
    bot.channels.cache.get("931457930325270614").send(`Bienvenue à <@${member.id}>, il vient d'arrivée sur le serveur!`)

}