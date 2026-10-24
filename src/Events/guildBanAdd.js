const Discord = require("discord.js")
const {getGuildConfig} = require("../Fonctions/guildConfig.js");

module.exports = async (bot, ban) => {

	const config = await getGuildConfig(bot, ban.guild.id);
	const logsChannel = ban.guild.channels.cache.get(config.logsChannelSanctions)
	if (!logsChannel) return;
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
				.setLabel("Retirer le bannissement")
				.setStyle(Discord.ButtonStyle.Danger)
		)

	const BanEmbed = new Discord.EmbedBuilder()
		.setColor(process.env.BOT_COLOR)
		.setAuthor({
			name: ban.user.displayName,
			iconURL: ban.user.displayAvatarURL({dynamic: true})
		})
		.setTitle("Un membre vient d'être banni.")
		.setDescription(`${ban.user} a été banni par ${executor} pour la raison :\n\n${ban.reason}.`)
		.setFooter({
			text: process.env.EMBED_FOOTER,
			iconURL: bot.user.displayAvatarURL({dynamic: true})
		})
		.setTimestamp()

	await logsChannel.send({embeds: [BanEmbed], components: [unban]});

	const xpSystemResults = await bot.function.executeQuery(`SELECT * FROM xp WHERE guild = '${ban.guild.id}' AND user = '${ban.user.id}'`, bot)

	if(xpSystemResults.length > 0) {
		if(xpSystemResults.time !== null){
			await bot.function.executeQuery(`DELETE FROM xp WHERE guild = '${ban.guild.id}' AND user = '${ban.user.id}'`, bot)
		}
	}
}
