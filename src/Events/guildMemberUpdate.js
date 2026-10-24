const Discord = require('discord.js');
const {getGuildConfig} = require("../Fonctions/guildConfig.js");

module.exports = async (bot, oldMember, newMember) => {

	const config = await getGuildConfig(bot, oldMember.guild.id);

	const boosterChannel = oldMember.guild.channels.cache.get(config.boosterChannel)

	if (config.boosterRole &&
		!oldMember.roles.cache.has(config.boosterRole) &&
		newMember.roles.cache.has(config.boosterRole)) {
		if (boosterChannel) {
			boosterChannel.send(`Merci à ${newMember} pour avoir boosté le serveur !`).catch(() => {});
		}
	}

	const logsChannel = oldMember.guild.channels.cache.get(config.logsChannelMember)
	if (!logsChannel) return;

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
		MemberUpdateEmbed.setTitle("Rôle ajouter :")
		MemberUpdateEmbed.setDescription(`${executor} a donné à ${newMember} les rôles suivants :\n\n${addedRoles.map(r => `${r}`).join(', ')}`)

		logsChannel.send({embeds: [MemberUpdateEmbed]})
	}

	if (removedRoles.size > 0) {
		MemberUpdateEmbed.setTitle("Rôle retirer :")
		MemberUpdateEmbed.setDescription(`${executor} a retiré à ${newMember} les rôles suivants :\n\n${removedRoles.map(r => `${r}`).join(', ')}`)

		logsChannel.send({embeds: [MemberUpdateEmbed]})
	}

	if (oldMember.displayName !== newMember.displayName) {
		if(executor.displayName !== newMember.displayName) {
			MemberUpdateEmbed.setTitle("Un membre à mis à jour son pseudonyme :")
			MemberUpdateEmbed.setDescription(`${executor} a changé le pseudonyme de ${oldMember}, de **${newMember.displayName}** à **${oldMember.displayName}**`)
		} else {
			MemberUpdateEmbed.setTitle("Un membre à mis à jour son pseudonyme :")
			MemberUpdateEmbed.setDescription(`Le membre ${oldMember} a changé de pseudonyme, de **${newMember.displayName}** à **${oldMember.displayName}**.`)
		}

		logsChannel.send({embeds: [MemberUpdateEmbed]})
	}
}
