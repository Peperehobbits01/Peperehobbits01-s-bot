const Discord = require('discord.js');

module.exports = async(bot, oldMember, newMember) => {

  const boosterChannel = oldMember.guild.channels.cache.get("931457930505629729")

  if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
    if (!oldMember.roles.cache.has("1056623425537445970") && newMember.roles.cache.has("1056623425537445970")) {
        boosterChannel.send(`Merci à ${newMember} pour avoir boost le serveur!`);
    }

    const logsChannel = oldMember.guild.channels.cache.get("1153675744917061732")

    if(oldMember.roles.cache.size && !newMember.roles.cache.size) {

        const removeRoles = new Discord.EmbedBuilder()
            .setColor("#d7342a")
            .setTitle("Suppression d'un rôle")
            .setDescription(`${newMember.user.tag} a perdu des rôles.`)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

            logsChannel.send({ embeds: [removeRoles] })

    } else if(!oldMember && newMember) {

        const addRoles = new Discord.EmbedBuilder()
            .setColor("#d7342a")
            .setTitle("Ajout d'un rôle")
            .setDescription(`${newMember.user.tag} a des nouveaux rôles.`)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

            logsChannel.send({ embeds: [addRoles] })
    }
  }

  if(oldMember.displayName !== newMember.displayName) {

    const logsChannel = oldMember.guild.channels.cache.get("1153675744917061732")

    const updateName = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle("Un membre a changée de pseudonyme")
        .setDescription(`Nouveau pseudo : ${newMember.displayName}\nAncien pseudo : ${oldMember.displayName}\nID du membre : ${newMember.id}`)
        .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

        logsChannel.send({ embeds: [updateName] })
  }
}