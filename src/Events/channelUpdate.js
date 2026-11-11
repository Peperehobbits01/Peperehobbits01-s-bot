const Discord = require("discord.js")
const channelTypeName = require("../Enum/channelTypeName.js")
const {getGuildConfig} = require("../Fonctions/guildConfig.js")

module.exports = async (bot, oldChannel, newChannel) => {
	if (!oldChannel.guild || oldChannel.type === Discord.ChannelType.DM) return;

	const guild = oldChannel.guild;
	const changes = [];
	const permissionChanges = [];
	const permissionActions = new Set();
	const permissionTargetIds = new Set();
	const oldPerms = oldChannel.permissionOverwrites?.cache;
	const newPerms = newChannel.permissionOverwrites?.cache;

	if (oldChannel.name !== newChannel.name) {
		changes.push({
			title: "Nom du salon",
			value: `Le nom du salon est passé de \`${oldChannel.name}\` à \`${newChannel.name}\`.`,
			auditKeys: ["name"],
		});
	}

	if (oldChannel.type !== newChannel.type) {
		changes.push({
			title: "Type du salon",
			value: `Le type du salon est passé de **${channelTypeName[oldChannel.type]}** à **${channelTypeName[newChannel.type]}**.`,
			auditKeys: ["type"],
		});
	}

	if (oldChannel.parentId !== newChannel.parentId) {
		const oldParent = oldChannel.parent?.name ?? (oldChannel.parentId ? "Catégorie indisponible" : "Aucune catégorie");
		const newParent = newChannel.parent?.name ?? (newChannel.parentId ? "Catégorie indisponible" : "Aucune catégorie");
		changes.push({
			title: "Catégorie",
			value: `Le salon a été déplacé de **${oldParent}** à **${newParent}**.`,
			auditKeys: ["parent_id"],
		});
	}

	if (oldChannel.topic !== newChannel.topic) {
		changes.push({
			title: "Description",
			value: `La description est passée de ${oldChannel.topic ? `\`${oldChannel.topic}\`` : "**aucune**"} à ${newChannel.topic ? `\`${newChannel.topic}\`` : "**aucune**"}.`,
			auditKeys: ["topic"],
		});
	}

	if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
		const oldDuration = oldChannel.rateLimitPerUser
			? bot.function.secondsToHms(oldChannel.rateLimitPerUser)
			: "désactivé";
		const newDuration = newChannel.rateLimitPerUser
			? bot.function.secondsToHms(newChannel.rateLimitPerUser)
			: "désactivé";
		changes.push({
			title: "Mode lent",
			value: `Le mode lent est passé de **${oldDuration}** à **${newDuration}**.`,
			auditKeys: ["rate_limit_per_user"],
		});
	}

	if (oldChannel.nsfw !== newChannel.nsfw) {
		changes.push({
			title: "Limite d'âge",
			value: `La limite d'âge est maintenant **${newChannel.nsfw ? "activée" : "désactivée"}**.`,
			auditKeys: ["nsfw"],
		});
	}

	if (oldPerms && newPerms) {
		for (const overwrite of newPerms.values()) {
			const oldOverwrite = oldPerms.get(overwrite.id);
			const target = overwrite.type === 1
				? `Membre <@${overwrite.id}>`
				: overwrite.id === guild.id
					? "@everyone"
					: guild.roles.cache.has(overwrite.id)
						? `<@&${overwrite.id}>`
						: `Rôle <@&${overwrite.id}>`;

			if (!oldOverwrite) {
				permissionActions.add(Discord.AuditLogEvent.ChannelOverwriteCreate);
				permissionTargetIds.add(overwrite.id);
				permissionChanges.push(
					`✅ Ajout pour ${target}: autoriser **${overwrite.allow.toArray().join(", ") || "Aucune"}**; refuser **${overwrite.deny.toArray().join(", ") || "Aucune"}**.`,
				);
				continue;
			}

			const oldAllow = oldOverwrite.allow.toArray();
			const newAllow = overwrite.allow.toArray();
			const oldDeny = oldOverwrite.deny.toArray();
			const newDeny = overwrite.deny.toArray();
			const changesForTarget = [];
			const addedAllow = newAllow.filter(permission => !oldAllow.includes(permission));
			const removedAllow = oldAllow.filter(permission => !newAllow.includes(permission));
			const addedDeny = newDeny.filter(permission => !oldDeny.includes(permission));
			const removedDeny = oldDeny.filter(permission => !newDeny.includes(permission));

			if (addedAllow.length) changesForTarget.push(`+ Autoriser: ${addedAllow.join(", ")}`);
			if (removedAllow.length) changesForTarget.push(`- Autoriser: ${removedAllow.join(", ")}`);
			if (addedDeny.length) changesForTarget.push(`+ Refuser: ${addedDeny.join(", ")}`);
			if (removedDeny.length) changesForTarget.push(`- Refuser: ${removedDeny.join(", ")}`);

			if (changesForTarget.length) {
				permissionActions.add(Discord.AuditLogEvent.ChannelOverwriteUpdate);
				permissionTargetIds.add(overwrite.id);
				permissionChanges.push(`⚠️ Modifications pour ${target}:\n${changesForTarget.join("\n")}`);
			}
		}

		for (const overwrite of oldPerms.values()) {
			if (newPerms.has(overwrite.id)) continue;

			permissionActions.add(Discord.AuditLogEvent.ChannelOverwriteDelete);
			permissionTargetIds.add(overwrite.id);
			const target = overwrite.type === 1
				? `Membre <@${overwrite.id}>`
				: overwrite.id === guild.id
					? "@everyone"
					: `Rôle <@&${overwrite.id}>`;
			permissionChanges.push(
				`⛔ Retrait pour ${target}: autoriser **${overwrite.allow.toArray().join(", ") || "Aucune"}**; refuser **${overwrite.deny.toArray().join(", ") || "Aucune"}**.`,
			);
		}
	}

	if (permissionChanges.length) {
		changes.push({
			title: "Permissions",
			value: permissionChanges.join("\n\n"),
			auditKeys: [],
		});
	}

	if (!changes.length) return;

	let config;
	try {
		config = await getGuildConfig(bot, guild.id);
	} catch (error) {
		bot.function.botLogsFile.error(`Impossible de lire la configuration des journaux du serveur ${guild.id} :`, error);
		return;
	}

	const logsChannel = guild.channels.cache.get(config.logsChannelChannel);
	if (!logsChannel || typeof logsChannel.send !== "function") return;

	const auditTypes = new Set(permissionActions);
	if (changes.some(change => change.auditKeys.length)) {
		auditTypes.add(Discord.AuditLogEvent.ChannelUpdate);
	}

	const auditResults = await Promise.all([...auditTypes].map(async type => {
		try {
			const logs = await guild.fetchAuditLogs({type, limit: 6});
			return {type, entries: [...logs.entries.values()]};
		} catch (error) {
			bot.function.botLogsFile.error(`Impossible de lire les journaux d'audit (${type}) du serveur ${guild.id} :`, error);
			return {type, entries: []};
		}
	}));
	const now = Date.now();
	const auditEntries = auditResults.flatMap(({type, entries: auditEntriesForType}) =>
		auditEntriesForType.flatMap(entry => {
			const age = now - entry.createdTimestamp;
			if (age < 0 || age > 5_000) return [];
			if (type === Discord.AuditLogEvent.ChannelUpdate) {
				if (entry.target?.id !== newChannel.id) return [];
				const expectedKeys = changes.flatMap(change => change.auditKeys);
				const changedKeys = entry.changes?.map(change => change.key) ?? [];
				if (changedKeys.length && !changedKeys.some(key => expectedKeys.includes(key))) return [];
				return [{entry, relevance: changedKeys.length ? 1 : 0}];
			}
			const auditChannelId = entry.extra?.channel?.id ?? entry.options?.channel_id;
			const matchesChannel = auditChannelId === newChannel.id || entry.target?.id === newChannel.id;
			if (!matchesChannel) return [];
			if (entry.target?.id !== newChannel.id && !permissionTargetIds.has(entry.target?.id)) return [];
			const changedKeys = entry.changes?.map(change => change.key) ?? [];
			if (changedKeys.length && !changedKeys.some(key => ["allow", "deny", "type"].includes(key))) return [];
			return [{entry, relevance: changedKeys.length ? 1 : 0}];
		}),
	).sort((a, b) => b.relevance - a.relevance || b.entry.createdTimestamp - a.entry.createdTimestamp);
	const executor = auditEntries[0]?.entry.executor;
	const actorName = executor?.username ?? "Utilisateur inconnu";
	const actorIcon = executor?.displayAvatarURL?.({dynamic: true});
	const entries = changes.map(change => `**${change.title}**\n${change.value}`);
	const descriptions = [];
	let currentDescription = "";

	for (const entry of entries) {
		const lines = entry.split("\n");
		for (const line of lines) {
			if (currentDescription && currentDescription.length + line.length + 1 > 3800) {
				descriptions.push(currentDescription);
				currentDescription = "";
			}
			if (line.length > 3800) {
				for (let offset = 0; offset < line.length; offset += 3800) {
					const part = line.slice(offset, offset + 3800);
					if (part) descriptions.push(part);
				}
				continue;
			}
			currentDescription += `${currentDescription ? "\n" : ""}${line}`;
		}
		if (currentDescription && currentDescription.length < 3700) currentDescription += "\n";
	}
	if (currentDescription.trim()) descriptions.push(currentDescription.trim());

	const embeds = descriptions.map(description => {
		return new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setAuthor({name: actorName, ...(actorIcon ? {iconURL: actorIcon} : {})})
			.setTitle("Modifications d'un salon")
			.setDescription(`${description}\n\nSalon : ${newChannel}`)
			.setFooter({text: process.env.EMBED_FOOTER, iconURL: bot.user.displayAvatarURL({dynamic: true})})
			.setTimestamp();
	});

	try {
		for (let index = 0; index < embeds.length; index += 10) {
			await logsChannel.send({embeds: embeds.slice(index, index + 10)});
		}
	} catch (error) {
		bot.function.botLogsFile.error(`Impossible d'envoyer le journal de modification du salon ${newChannel.id} :`, error);
	}
}
