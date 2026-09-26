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

	if (addedRoles.size > 0) {
		const addRolesEmbed = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setAuthor({
				name: executor.displayName,
				iconURL: executor.displayAvatarURL({dynamic: true})
			})
			.setDescription(`${newMember} a reçu les rôles suivants : ${addedRoles.map(r => `${r}`).join(', ')}\n\nUtilisateur : ${newMember.user.tag}\nPar : ${executor.displayName}\n\n**ID** :\nUtilisateur : ${oldMember.id}\nPar : ${executor.id}`)
			.setFooter({
				text: process.env.EMBED_FOOTER,
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})
			.setTimestamp()

		if (logsChannel) logsChannel.send({embeds: [addRolesEmbed]})
	}

	if (removedRoles.size > 0) {
		const removeRolesEmbed = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setAuthor({
				name: executor.displayName,
				iconURL: executor.displayAvatarURL({dynamic: true})
			})
			.setDescription(`${newMember} a perdu les rôles suivants : ${removedRoles.map(r => `${r}`).join(', ')}\n\nUtilisateur : ${newMember.user.tag}\nPar : ${executor.displayName}\n\n**ID** :\nUtilisateur : ${oldMember.id}\nPar : ${executor.id}`)
			.setFooter({
				text: process.env.EMBED_FOOTER,
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})
			.setTimestamp()

		if (logsChannel) logsChannel.send({embeds: [removeRolesEmbed]})
	}

	if (oldMember.displayName !== newMember.displayName) {

		const updateName = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setAuthor({
				name: executor.displayName,
				iconURL: executor.displayAvatarURL({dynamic: true})
			})
			.setDescription(`Le membre ${oldMember} a changé de pseudonyme.\n\nNouveau pseudo : ${newMember.displayName}\nAncien pseudo : ${oldMember.displayName}\nID du membre : ${newMember.id}`)
			.setFooter({
				text: process.env.EMBED_FOOTER,
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})
			.setTimestamp()

		if (logsChannel) logsChannel.send({embeds: [updateName]})
	}
}
