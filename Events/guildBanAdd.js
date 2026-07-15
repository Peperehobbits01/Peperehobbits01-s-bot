const Discord = require("discord.js")

module.exports = async(bot, ban) => {

    const logsChannel = ban.guild.channels.cache.get(process.env.LOGS_CHANNEL);

    const fetchedLogs = await ban.guild.fetchAuditLogs({
        type: Discord.AuditLogEvent.guildBanAdd,
        limit: 5,
    });

    const channelLog = fetchedLogs.entries.find(entry =>
        entry.target?.id === ban.id
    );

    const executor = channelLog?.executor;

    const unban = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`unban-${ban.user.id}`)
                .setLabel("Retirée le bannisement")
                .setStyle(Discord.ButtonStyle.Danger)
        )

    const BanEmbed = new Discord.EmbedBuilder()
        .setColor(process.env.BOT_COLOR)
        .setAuthor({
            name : ban.displayName,
            iconURL: ban.user.displayAvatarURL({dynamic: true})
        })
        .setDescription(`${ban.user.username} a été banni par ${executor} pour la raison ${ban.reason}\nNom de l'utilisateur : ${ban.user}\nRaison : ${ban.reason}\nPar l'utilisateur : ${executor.name}\n**ID** :\nL'utilisateur : \`${ban.user.id}\`\nPar l'utilisateur : \`${executor.id}\``)
        .setFooter({
            text: "Gérée par l'instance de Peperehobbits01's Bot",
            iconURL: bot.user.displayAvatarURL({dynamic: true})
        })
        .setTimestamp()

    await logsChannel.send({ embeds: [BanEmbed], components: [unban] });
}