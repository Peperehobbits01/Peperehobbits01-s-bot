const Discord = require("discord.js")
const {getGuildConfig} = require("../Fonctions/guildConfig.js");

module.exports = async (bot, ban) => {

	const config = await getGuildConfig(bot, ban.guild.id);
	const logsChannel = ban.guild.channels.cache.get(config.logsChannelSanctions)
	if (!logsChannel) return;
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
			name: ban.user.displayName,
			iconURL: ban.user.displayAvatarURL({dynamic: true})
		})
		.setTitle("Un utilisateur a été débanni.")
		.setDescription(`${ban.user} a été débanni par ${executor}, la raison du bannisement était :\n\n${ban.reason}.`)
		.setFooter({
			text: process.env.EMBED_FOOTER,
			iconURL: bot.user.displayAvatarURL({dynamic: true})
		})
		.setTimestamp()

	await logsChannel.send({embeds: [BanEmbed]})

	const searchForBanUser = await bot.function.executeQuery(`SELECT * FROM sanctions_list WHERE guildId = '${ban.guild.id}' AND userID = '${ban.user}'`, bot)

	if(searchForBanUser && searchForBanUser.sanctions_type === "TEMPBAN") {
		await bot.function.executeQuery(`UPDATE sanctions_list SET expired = 1 WHERE guildId = ${ban.guild.id} AND userID = '${ban.user.id}' AND sanctionID = '${searchForBanUser.sanctionID}'`, bot)
	}
}
