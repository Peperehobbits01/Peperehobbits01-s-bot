const Discord = require('discord.js')
const channelTypeName = require("../Enum/channelTypeName.js")
const {getGuildConfig} = require("../Fonctions/guildConfig.js")

module.exports = async (bot, oldChannel, newChannel) => {

	if (oldChannel.type === Discord.ChannelType.DM) return;
	const config = await getGuildConfig(bot, oldChannel.guild.id);
	const logsChannel = oldChannel.guild.channels.cache.get(config.logsChannelChannel)
	if (!logsChannel) return;
	const oldReadableChannelType = channelTypeName[oldChannel.type];
	const newReadableChannelType = channelTypeName[newChannel.type];

	const fetchedLogs = await oldChannel.guild.fetchAuditLogs({
		type: Discord.AuditLogEvent.ChannelUpdate,
		limit: 5,
	});

	const channelLog = fetchedLogs.entries.find(entry =>
		entry.target?.id === oldChannel.id && Date.now() - entry.createdTimestamp < 5000
	);

	let executor = channelLog?.executor;

	const channelUpdateEmbed = new Discord.EmbedBuilder()
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

	if (oldChannel.name !== newChannel.name) {

		channelUpdateEmbed.setTitle("Un nom de salon a été changer.")
		channelUpdateEmbed.setDescription(`Le nom du salon ${oldReadableChannelType} ${oldChannel.name} a été changer par ${executor} en ${newChannel}.`)

		await logsChannel.send({embeds: [channelUpdateEmbed]})
	}

	if (oldChannel.type !== newChannel.type) {

		channelUpdateEmbed.setTitle("Un salon vient de changer de type.")
		channelUpdateEmbed.setDescription(`Le type du salon ${oldChannel} a été changer par ${executor} de ${oldReadableChannelType} à ${newReadableChannelType}.`)

		await logsChannel.send({embeds: [channelUpdateEmbed]})
	}

	if (oldChannel.parentId !== newChannel.parentId) {

		channelUpdateEmbed.setTitle("Un salon a été déplacé dans une nouvelle catégorie.")
		channelUpdateEmbed.setDescription(`Le salon ${oldReadableChannelType} ${oldChannel} a été déplacé par un utilisateur de la catégorie ${oldChannel.parent} à la catégorie ${newChannel.parent}.`)

		await logsChannel.send({embeds: [channelUpdateEmbed]})
	}

	if (oldChannel.topic !== newChannel.topic) {

		channelUpdateEmbed.setTitle("La description d'un salon a été modifié.")
		channelUpdateEmbed.setDescription(`Le salon ${oldReadableChannelType} ${oldChannel} a vue sa description modifier par ${executor} de "${oldChannel.topic}" à "${newChannel.topic}"`)

		await logsChannel.send({embeds: [channelUpdateEmbed]})
	}

	if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
		function secondsToHms(d) {
			d = Number(d);
			const h = Math.floor(d / 3600);
			const m = Math.floor(d % 3600 / 60);
			const s = Math.floor(d % 3600 % 60);

			const hDisplay = h > 0 ? h + (h === 1 ? "h, " : "h, ") : "";
			const mDisplay = m > 0 ? m + (m === 1 ? "m, " : "m, ") : "";
			const sDisplay = s > 0 ? s + (s === 1 ? "s" : "s") : "";
			return hDisplay + mDisplay + sDisplay;
		}

		if (oldChannel.rateLimitPerUser === 0 && newChannel.rateLimitPerUser > 0) {
			const duration = secondsToHms(newChannel.rateLimitPerUser);

			channelUpdateEmbed.setTitle("Un salon vient d'être soumis au mode lent.")
			channelUpdateEmbed.setDescription(`Le salon ${oldReadableChannelType} ${oldChannel} vient d'être soumis au mode lent de ${duration} par ${executor}.`)

			await logsChannel.send({embeds: [channelUpdateEmbed]})
		} else if (oldChannel.rateLimitPerUser > 0 && newChannel.rateLimitPerUser === 0) {
			const duration = secondsToHms(oldChannel.rateLimitPerUser);

			channelUpdateEmbed.setTitle("Un salon n'est plus soumis au mode lent.")
			channelUpdateEmbed.setDescription(`Le salon ${oldReadableChannelType} ${oldChannel} n'est plus soumis au mode lent de ${duration} par ${executor}.`)

			await logsChannel.send({embeds: [channelUpdateEmbed]})
		} else if (oldChannel.rateLimitPerUser > 0 && newChannel.rateLimitPerUser > 0) {
			const oldDuration = secondsToHms(oldChannel.rateLimitPerUser);
			const newDuration = secondsToHms(newChannel.rateLimitPerUser);

			channelUpdateEmbed.setTitle("La durée du mode lent a été changé dans un salon.")
			channelUpdateEmbed.setDescription(`Le salon ${oldReadableChannelType} ${oldChannel} a un changement de la durée du mode lent de ${oldDuration} à ${newDuration} par ${executor}.`)

			await logsChannel.send({embeds: [channelUpdateEmbed]})
		}
	}

	const oldPerms = oldChannel.permissionOverwrites.cache;
	const newPerms = newChannel.permissionOverwrites.cache;
	const permChanges = [];

	if (oldPerms && newPerms) {
		newPerms.forEach((overwrite) => {
			const oldOverwrite = oldPerms.get(overwrite.id);
			if (!oldOverwrite) {
				const newAllow = overwrite.allow.toArray().join(', ') || 'Aucune';
				const newDeny = overwrite.deny.toArray().join(', ') || 'Aucune';
				permChanges.push(`✅ Ajout de ${oldChannel.guild.roles.cache.get(overwrite.id)} :\n\`\`\` Autoriser: ${newAllow}\n Interdit: ${newDeny}\`\`\``);
				return;
			}

			const oldAllow = oldOverwrite.allow.toArray();
			const newAllow = overwrite.allow.toArray();
			const oldDeny = oldOverwrite.deny.toArray();
			const newDeny = overwrite.deny.toArray();

			const addedAllow = newAllow.filter(p => !oldAllow.includes(p));
			const removedAllow = oldAllow.filter(p => !newAllow.includes(p));
			const addedDeny = newDeny.filter(p => !oldDeny.includes(p));
			const removedDeny = oldDeny.filter(p => !newDeny.includes(p));

			const changes = [];
			if (addedAllow.length) changes.push(`+ Autoriser: ${addedAllow.join(', ')}`);
			if (removedAllow.length) changes.push(`- Autoriser: ${removedAllow.join(', ')}`);
			if (addedDeny.length) changes.push(`+ Interdit: ${addedDeny.join(', ')}`);
			if (removedDeny.length) changes.push(`- Interdit: ${removedDeny.join(', ')}`);

			if (changes.length) {
				permChanges.push(`⚠️ Changement pour ${oldChannel.guild.roles.cache.get(overwrite.id)} :\n\`\`\` ${changes.join('\n ')}\`\`\``);
			}
		});

		oldPerms.forEach((overwrite) => {
			if (!newPerms.get(overwrite.id)) {
				const oldAllow = overwrite.allow.toArray().join(', ') || 'Aucune';
				const oldDeny = overwrite.deny.toArray().join(', ') || 'Aucune';
				permChanges.push(`⛔ Retrait de ${oldChannel.guild.roles.cache.get(overwrite.id)} :\n\`\`\` Autoriser: ${oldAllow}\n Interdit: ${oldDeny}\`\`\``);
			}
		});
	}

	if (permChanges.length > 0) {
		const permissionsFetchedLogs = await oldChannel.guild.fetchAuditLogs({
			type: Discord.AuditLogEvent.ChannelPermissionUpdates,
			limit: 5,
		});

		const permissionsChannelLog = permissionsFetchedLogs.entries.find(entry =>
			entry.target?.id === oldChannel.id && Date.now() - entry.createdTimestamp < 5000
		);

		executor = permissionsChannelLog?.executor || executor;

			channelUpdateEmbed.setTitle("Les permissions d'un salon on été modifié.")
			channelUpdateEmbed.setDescription(`Les permissions du salon ${oldReadableChannelType} ${oldChannel} ont été modifiées par ${executor}, en voici la liste :\n\n${permChanges.join('\n')}\n`)

		await logsChannel.send({embeds: [channelUpdateEmbed]})
	}

	if (oldChannel.nsfw !== newChannel.nsfw) {
		if (oldChannel.nsfw === false) {

			channelUpdateEmbed.setTitle("Un salon vient d'être soumis à une limite d'âge.")
			channelUpdateEmbed.setDescription(`Le salon ${oldReadableChannelType} ${oldChannel} vient d'être soumis à une limite d'âge par ${executor}.`)

			await logsChannel.send({embeds: [channelUpdateEmbed]})
		} else if (oldChannel.nsfw === true) {

			channelUpdateEmbed.setTitle("Un salon n'est plus soumis à une limite d'âge.")
			channelUpdateEmbed.setDescription(`Le salon ${oldReadableChannelType} ${oldChannel} n'est plus soumis à une limite d'âge par ${executor}.`)

			await logsChannel.send({embeds: [channelUpdateEmbed]})
		}
	}
}
