const Discord = require('discord.js');

module.exports = async(bot, oldMember, newMember) => {

  const boosterChannel = "931457930505629729"
  const guild = "931457929431908373"

  if (guild.oldMember.roles.cache.size !== guild.newMember.roles.cache.size) {
    if (!guild.oldMember.roles.cache.has("1056623425537445970") && guild.newMember.roles.cache.has("1056623425537445970")) {
        boosterChannel.send(`Merci à ${newMember} pour avoir boost le serveur!`);
    }

    const logsChannel = "931457930660835333"

    if(oldMember.guild && !newMember.guild) {

        const removeRoles = new Discord.EmbedBuilder()
            .setColor("#d7342a")
            .setTitle("Suppression d'un rôle")
            .setDescription(`${guild.newMember.user.tag} a perdu des rôles.`)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

            logsChannel.send({ embeds: [removeRoles] })

    } else if(!oldMember.guild && newMember.guild) {

        const addRoles = new Discord.EmbedBuilder()
            .setColor("#d7342a")
            .setTitle("Ajout d'un rôle")
            .setDescription(`${guild.newMember.user.tag} a des nouveaux rôles.`)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

            logsChannel.send({ embeds: [addRoles] })
    }

  }
}