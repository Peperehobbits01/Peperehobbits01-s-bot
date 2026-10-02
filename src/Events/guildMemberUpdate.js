const Discord = require('discord.js');
const {getGuildConfig} = require("../Fonctions/guildConfig.js");

module.exports = async (bot, oldMember, newMember) => {

	const config = await getGuildConfig(oldMember.guild.id);

	const boosterChannel = config.boosterChannel
		? oldMember.guild.channels.cache.get(config.boosterChannel)
		: null

	if (config.boosterRole &&
		!oldMember.roles.cache.has(config.boosterRole) &&
		newMember.roles.cache.has(config.boosterRole)) {
		if (boosterChannel) {
			boosterChannel.send(`Merci à ${newMember} pour avoir boosté le serveur !`).catch(() => {});
		}
	}

	const logsChannel = config.logsChannelMember
		? oldMember.guild.channels.cache.get(config.logsChannelMember)
		: null

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
	const MemberUpdateEmbed = new Discord.EmbedBuilder()
		.setColor(process.env.BOT_COLOR)
		.setAuthor({
			name: executor.displayName,
			iconURL: executor.displayAvatarURL({dynamic: true})
		})
		.setFooter({
			text: process.env.EMBED_FOOTER,
			iconURL: bot.user.displayAvatarURL({dynamic: true})
		})
		.setTimestamp()

	if (addedRoles.size > 0) {
		MemberUpdateEmbed.setDescription(`**Rôle ajouter :**\n${newMember} a reçu les rôles suivants : ${addedRoles.map(r => `${r}`).join(', ')}\n\nDonner par : ${executor}`)

		if (logsChannel) logsChannel.send({embeds: [MemberUpdateEmbed]})
	}

	if (removedRoles.size > 0) {
		MemberUpdateEmbed.setDescription(`**Rôle retirer :**\n${newMember} a perdu les rôles suivants : ${removedRoles.map(r => `${r}`).join(', ')}\n\nRetirer par : ${executor.displayName}`)

		if (logsChannel) logsChannel.send({embeds: [MemberUpdateEmbed]})
	}

	if (oldMember.displayName !== newMember.displayName) {
		MemberUpdateEmbed.setDescription(`**Pseudonyme mise à jour :**\nLe membre ${oldMember} a changé de pseudonyme, de **${newMember.displayName}** à **${oldMember.displayName}**\n\nChange par : ${executor}`)

		if (logsChannel) logsChannel.send({embeds: [MemberUpdateEmbed]})
	}
}
