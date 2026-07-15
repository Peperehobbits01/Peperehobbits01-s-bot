const Discord = require("discord.js")

module.exports = async(bot, ban) => {

    const logsChannel = ban.guild.channels.cache.get(process.env.LOGS_CHANNEL);

    const fetchedLogs = await ban.guild.fetchAuditLogs({
        type: Discord.AuditLogEvent.guildBanRemove,
        limit: 5,
    });

    const channelLog = fetchedLogs.entries.find(entry =>
        entry.target?.id === ban.id
    );

    const executor = channelLog?.executor;

    const BanEmbed = new Discord.EmbedBuilder()
        .setColor(process.env.BOT_COLOR)
        .setAuthor({
            name : ban.displayName,
            iconURL: ban.user.displayAvatarURL({dynamic: true})
        })
        .setDescription(`${ban.user.username} a été débanni par ${executor}\nNom de l'utilisateur : ${ban.user}\nRaison du ban : ${ban.reason}\nPar l'utilisateur : ${executor.name}\n**ID** :\nL'utilisateur : \`${ban.user.id}\`\nPar l'utilisateur : \`${executor.id}\``)
        .setFooter({
            text: "Gérée par l'instance de Peperehobbits01's Bot",
            iconURL: bot.user.displayAvatarURL({dynamic: true})
        })
        .setTimestamp()

    await logsChannel.send({ embeds: [BanEmbed] })
}