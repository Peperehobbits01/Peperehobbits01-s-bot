const Discord = require('discord.js');

module.exports = async(bot, oldMember, newMember) => {

    const boosterChannel = oldMember.guild.channels.cache.get(process.env.BOOSTER_CHANNEL)

    if (!oldMember.roles.cache.has(process.env.BOOSTER_ROLE) && newMember.roles.cache.has(process.env.BOOSTER_ROLE)) {
        boosterChannel.send(`Merci à ${newMember} pour avoir boost le serveur!`);
    }

    const logsChannel = oldMember.guild.channels.cache.get(process.env.LOGS_CHANNEL_MEMBER)

    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));

    const fetchedLogs = await oldMember.guild.fetchAuditLogs({
        type: Discord.AuditLogEvent.guildMembers,
        limit: 5,
    });

    const channelLog = fetchedLogs.entries.find(entry =>
        entry.target?.id === oldMember.id
    );

    const executor = channelLog?.executor;

    if (addedRoles.size > 0) {
        const addRolesEmbed = new Discord.EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({name: executor.displayName, iconURL: executor.displayAvatarURL({dynamic : true})})
            .setDescription(`${newMember} a reçu les rôles suivants : ${addedRoles.map(r => `${r}`).join(', ')}\n\nUtilisateur : ${newMember.user.tag}\nPar : ${executor.displayName}\n\n**ID** :\nUtilisateur : ${oldMember.id}\nPar : ${executor.id}`)
            .setFooter({
                text: "Gérée par l'instance de Peperehobbits01's Bot",
                iconURL: bot.user.displayAvatarURL({ dynamic: true })
            })

        logsChannel.send({ embeds: [addRolesEmbed] })
    }

    if (removedRoles.size > 0) {
        const removeRolesEmbed = new Discord.EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({name: executor.displayName, iconURL: executor.displayAvatarURL({dynamic : true})})
            .setDescription(`${newMember} a perdu les rôles suivants : ${removedRoles.map(r => `${r}`).join(', ')}\n\nUtilisateur : ${newMember.user.tag}\nPar : ${executor.displayName}\n\n**ID** :\nUtilisateur : ${oldMember.id}\nPar : ${executor.id}`)
            .setFooter({
                text: "Gérée par l'instance de Peperehobbits01's Bot",
                iconURL: bot.user.displayAvatarURL({ dynamic: true })
            })

        logsChannel.send({ embeds: [removeRolesEmbed] })

    if(oldMember.displayName !== newMember.displayName) {

        const updateName = new Discord.EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({name: executor.displayName, iconURL: executor.displayAvatarURL({dynamic: true})})
            .setDescription(`Le membre ${oldMember} à changée de pseudonyme.\n\nNouveau pseudo : ${newMember.displayName}\nAncien pseudo : ${oldMember.displayName}\nID du membre : ${newMember.id}`)
            .setFooter({
                text: "Gérée par l'instance de Peperehobbits01's Bot",
                iconURL: bot.user.displayAvatarURL({dynamic: true})
            })

        logsChannel.send({embeds: [updateName]})
    }
  }
}