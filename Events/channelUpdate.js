const Discord = require('discord.js')
const { channelTypeName } = require("../Fonctions/channelTypeName.js")

module.exports = async(bot, oldChannel, newChannel) => {

    if(oldChannel.type === Discord.ChannelType.DM) return;
    const logsChannel = oldChannel.guild.channels.cache.get(process.env.LOGS_CHANNEL_CHANNEL);
    const oldReadableChannelType = channelTypeName(oldChannel.type);
    const newReadableChannelType = channelTypeName(newChannel.type);

    const fetchedLogs = await oldChannel.guild.fetchAuditLogs({
        type: Discord.AuditLogEvent.ChannelUpdate,
        limit: 5,
    });

    const channelLog = fetchedLogs.entries.find(entry =>
        entry.target?.id === oldChannel.id && Date.now() - entry.createdTimestamp < 5000
    );

    const executor = channelLog?.executor;

    if(oldChannel.name !== newChannel.name) {

        const UpdateChannelName = new Discord.EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({ name: executor.displayName, iconURL: executor.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Le nom du salon ${oldChannel.name} a été changer par ${executor} en ${newChannel.name}\n\nAncien nom du salon : ${oldChannel.name}\nNouveau nom du salon : ${newChannel.name}\nType de salon : ${oldReadableChannelType}\n\n**ID** :\nSalon : \`${oldChannel.id}\`\nUtilisateur : \`${executor.id}\``)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

        await logsChannel.send({embeds: [UpdateChannelName]})
    }

    if(oldChannel.type !== newChannel.type) {

        const UpdateChannelType = new Discord.EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({ name: executor.displayName, iconURL: executor.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Le type du salon ${oldChannel.name} a été changer par ${executor} de ${oldReadableChannelType} à ${newReadableChannelType}\n\nNom du salon : ${oldChannel}\nAncien type du salon : ${oldReadableChannelType}\nNouveau type du salon : ${newReadableChannelType}\n\n**ID** :\nSalon : \`${oldChannel.id}\`\nUtilisateur : \`${executor.id}\``)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

        await logsChannel.send({embeds: [UpdateChannelType]})
    }

    if(oldChannel.parentId !== newChannel.parentId) {

        const UpdateChannelParentID = new Discord.EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({ name: "Impossible de trouver le pseudo", iconURL: bot.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Le salon ${oldChannel.name} a été déplacé par un utilisateur de la catégorie ${oldChannel.parent} à la catégorie ${newChannel.parent}\n\nNom du salon : ${oldChannel}\nType du salon : ${oldReadableChannelType}\nAncienne catégorie du salon : ${oldChannel.parentId}\nNouvelle catégorie du salon : ${newChannel.parentId}\n\n**ID** :\nSalon : \`${oldChannel.id}\`\nAncienne catégorie : \`${oldChannel.parentId}\`\nNouvelle catégorie : \`${newChannel.parentId}\``)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

        await logsChannel.send({embeds: [UpdateChannelParentID]})
    }

    if(oldChannel.topic !== newChannel.topic) {

        /*if(oldChannel.topic === "null") {
            oldChannel.topic = "Aucune description"
        } else if (newChannel.topic === "null") {
            newChannel.topic = "Aucune description"
        }*/

        const UpdateChannelTopic = new Discord.EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({ name: executor.displayName, iconURL: executor.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Le salon ${oldChannel.name} a vue sa description modifier par ${executor} de "${oldChannel.topic}" à "${newChannel.topic}"\n\nNom du salon : ${oldChannel}\nType du salon : ${oldReadableChannelType}\nAncienne description du salon : ${oldChannel.topic}\nNouvelle description du salon : ${newChannel.topic}\n\n**ID** :\nSalon : \`${oldChannel.id}\`\nUtilisateur : \`${executor.id}\``)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

        await logsChannel.send({embeds: [UpdateChannelTopic]})
    }

    if (oldChannel.rateLimitPerUser === 0 && newChannel.rateLimitPerUser > 0) {

        const UpdateChannelSlowModeON = new Discord.EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({ name: executor.displayName, iconURL: executor.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Le salon ${oldChannel.name} vient d'être soumis au mode lent de ${newChannel.rateLimitPerUser}s par ${executor}.\n\nNom du salon : ${oldChannel}\nType du salon : ${oldReadableChannelType}\nPassage en mode lent : Oui\nDurée du mode lent : ${newChannel.rateLimitPerUser}s\n\n**ID** :\nSalon : \`${oldChannel.id}\`\nUtilisateur : \`${executor.id}\``)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

        await logsChannel.send({embeds: [UpdateChannelSlowModeON]})
    } else if (oldChannel.rateLimitPerUser > 0 && newChannel.rateLimitPerUser === 0) {

        const UpdateChannelSlowModeOFF = new Discord.EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({ name: executor.displayName, iconURL: executor.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Le salon ${oldChannel.name} n'est plus soumis  au mode lent de ${oldChannel.rateLimitPerUser}s par ${executor}.\n\nNom du salon : ${oldChannel}\nType du salon : ${oldReadableChannelType}\nPassage en mode lent : Non\nDurée du mode lent : ${oldChannel.rateLimitPerUser}s\n\n**ID** :\nSalon : \`${oldChannel.id}\`\nUtilisateur : \`${executor.id}\``)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

        await logsChannel.send({embeds: [UpdateChannelSlowModeOFF]})
    } else if (oldChannel.rateLimitPerUser > 0 && newChannel.rateLimitPerUser > 0 && oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {

        const UpdateChannelSlowModeChange = new Discord.EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({ name: executor.displayName, iconURL: executor.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Le salon ${oldChannel.name} a un changement de la durée du mode lent de ${oldChannel.rateLimitPerUser}s à ${newChannel.rateLimitPerUser}s par ${executor}.\n\nNom du salon : ${oldChannel}\nType du salon : ${oldReadableChannelType}\nAncienne durée du mode lent : ${oldChannel.rateLimitPerUser}s\nNouvelle durée du mode lent : ${newChannel.rateLimitPerUser}s\n\n**ID** :\nSalon : \`${oldChannel.id}\`\nUtilisateur : \`${executor.id}\``)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

        await logsChannel.send({embeds: [UpdateChannelSlowModeChange]})
    }
    //TODO permissionsOverwrites changes mentioning in embed.
    if(oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {

        const fetchedLogs = await oldChannel.guild.fetchAuditLogs({
            type: Discord.AuditLogEvent.permissionOverwrites,
            limit: 5,
        });

        const channelLog = fetchedLogs.entries.find(entry =>
            entry.target?.id === oldChannel.id && Date.now() - entry.createdTimestamp < 5000
        );

        const executorPermissions = channelLog?.executor;

        const UpdateChannelPermissions = new Discord.EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({ name: executorPermissions.displayName, iconURL : executorPermissions.displayAvatarURL({ dynamic : true})})
            .setDescription(`Les permissions du salon ${oldChannel.name} ont été modifier par ${executorPermissions.displayName}.\n\nNom du salon : ${oldChannel.name}\nType du salon : ${oldReadableChannelType}\nAncienne permisions: ${oldPermsString}\n Nouvelle permissions: ${newPermsString}\n\n**ID** :\nSalon : \`${oldChannel.id}\`\nUtilisateur : \`${executorPermissions.id}\``)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's bot", iconURL: bot.user.displayAvatarURL({ dynamic : true})})
            .setTimestamp()

        await logsChannel.send({embeds: [UpdateChannelPermissions]})
    }

    if(oldChannel.nsfw !== newChannel.nsfw) {

        if(oldChannel.nsfw === false) {

            const UpdateChannelNSFW = new Discord.EmbedBuilder()
                .setColor(process.env.BOT_COLOR)
                .setAuthor({ name: executor.displayName, iconURL: executor.displayAvatarURL({ dynamic: true }) })
                .setDescription(`Le salon ${oldChannel.name} vient d'être soumis à une limite d'âge par ${executor}.\n\nNom du salon : ${oldChannel}\nType du salon : ${oldReadableChannelType}\nPassage en mode NSFW : Oui\n\n**ID** :\nSalon : \`${oldChannel.id}\`\nUtilisateur : \`${executor.id}\``)
                .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()

            await logsChannel.send({embeds: [UpdateChannelNSFW]})
        } else if(oldChannel.nsfw === true) {

            const UpdateChannelNSFW = new Discord.EmbedBuilder()
                .setColor(process.env.BOT_COLOR)
                .setAuthor({ name: executor.displayName, iconURL: executor.displayAvatarURL({ dynamic: true }) })
                .setDescription(`Le salon ${oldChannel.name} n'est plus soumis à une limite d'âge par ${executor}.\n\nNom du salon : ${oldChannel}\nType du salon : ${oldReadableChannelType}\nPassage en mode NSFW : Non\n\n**ID** :\nSalon : \`${oldChannel.id}\`\nUtilisateur : \`${executor.id}\``)
                .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()

            await logsChannel.send({embeds: [UpdateChannelNSFW]})
        }
    }
}