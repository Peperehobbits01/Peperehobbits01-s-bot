const Discord = require("discord.js")

const PAGE_SIZE = 10;

function parseTimestamp(value) {
	const timestamp = Number(value);
	return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null;
}

function formatReason(reason) {
	const value = String(reason ?? "Aucune raison fournie").replace(/[`*_~|>\\]/g, "\\$&").trim();
	return value.length > 300 ? `${value.slice(0, 297)}...` : value;
}

function formatAuthor(authorId, users) {
	if (!authorId) return "Utilisateur inconnu";
	const author = users.get(String(authorId));
	return author ? `${author.username} (\`${author.id}\`)` : `<@${authorId}>`;
}

function formatBanStatus(ban, sanctionMetadata) {
	const metadata = sanctionMetadata.get(String(ban.ban));
	if (metadata?.expired) return "Expiré";
	if (metadata?.type === "BAN") return "Permanent";

	const expiration = parseTimestamp(ban.time);
	if (expiration) {
		return expiration > Date.now()
			? `Expire <t:${Math.floor(expiration / 1000)}:R>`
			: "Expiré";
	}

	if (metadata?.type === "TEMPBAN") return "Temporaire — échéance indisponible";
	return !ban.time || ban.time === "null" ? "Permanent" : "Échéance indisponible";
}

function formatSanction(sanction, users, sanctionMetadata, index) {
	const {type, record} = sanction;
	const timestamp = parseTimestamp(record.date);
	const details = [
		`- **Auteur :** ${formatAuthor(record.author, users)}`,
		`- **ID :** \`${record.id}\``,
		`- **Raison :** ${formatReason(record.reason)}`,
		`- **Date :** ${timestamp ? `<t:${Math.floor(timestamp / 1000)}:f>` : "Inconnue"}`,
	];

	if (type === "Timeout" && record.time) {
		details.splice(3, 0, `- **Durée :** ${formatReason(record.time)}`);
	}
	if (type === "Ban") {
		details.splice(3, 0, `- **Statut :** ${formatBanStatus(record, sanctionMetadata)}`);
	}

	return `### ${index}. ${type} — \`${record.id}\`\n${details.join("\n")}`;
}

function buildSanctionsContainer(bot, user, requesterId, sanctions, users, sanctionMetadata, page, pageCount, includePagination = true) {
	const pageSanctions = sanctions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
	const categories = [...new Set(pageSanctions.map(sanction => sanction.type))];
	const container = new Discord.ContainerBuilder()
		.setAccentColor(parseInt(process.env.BOT_COLOR.replace("#", ""), 16))
		.addSectionComponents(
			new Discord.SectionBuilder()
				.addTextDisplayComponents(
					new Discord.TextDisplayBuilder().setContent(`# __Sanctions de ${user.globalName ?? user.username}__`),
					new Discord.TextDisplayBuilder().setContent(
						`**${sanctions.length}** infraction(s) • Page **${page + 1}/${pageCount}**`
					),
				)
				.setThumbnailAccessory(
					new Discord.ThumbnailBuilder().setURL(user.displayAvatarURL({extension: "png", forceStatic: true}))
				),
		);

	for (const [categoryIndex, type] of categories.entries()) {
		const group = pageSanctions.filter(sanction => sanction.type === type);
		if (categoryIndex > 0) {
			container.addSeparatorComponents(
				new Discord.SeparatorBuilder().setDivider(true).setSpacing(Discord.SeparatorSpacingSize.Small),
			);
		}

		container.addTextDisplayComponents(
			new Discord.TextDisplayBuilder().setContent(`## ${type} • ${group.length} sur cette page`),
		);

		const records = group.map(sanction =>
			formatSanction(sanction, users, sanctionMetadata, sanctions.indexOf(sanction) + 1),
		);
		let content = "";
		for (const record of records) {
			if (content && content.length + record.length + 2 > 3800) {
				container.addTextDisplayComponents(new Discord.TextDisplayBuilder().setContent(content));
				content = "";
			}
			content += `${content ? "\n\n" : ""}${record}`;
		}
		if (content) {
			container.addTextDisplayComponents(new Discord.TextDisplayBuilder().setContent(content));
		}
	}

	if (includePagination && pageCount > 1) {
		container
			.addSeparatorComponents(
				new Discord.SeparatorBuilder().setDivider(true).setSpacing(Discord.SeparatorSpacingSize.Small),
			)
			.addActionRowComponents(buildPaginationRow(page, pageCount, user.id, requesterId));
	}
	return container;
}

function buildPaginationRow(page, pageCount, targetId, requesterId) {
	return new Discord.ActionRowBuilder().addComponents(
		new Discord.ButtonBuilder()
			.setCustomId(`sanctions-list:${targetId}:${requesterId}:${page - 1}`)
			.setLabel("Précédent")
			.setStyle(Discord.ButtonStyle.Secondary)
			.setDisabled(page === 0),
		new Discord.ButtonBuilder()
			.setCustomId(`sanctions-list:${targetId}:${requesterId}:${page + 1}`)
			.setLabel("Suivant")
			.setStyle(Discord.ButtonStyle.Secondary)
			.setDisabled(page >= pageCount - 1),
	);
}

async function loadSanctionsData(bot, guildId, userId) {
	const queries = [
		["SELECT author, note AS id, reason, date FROM note WHERE guild = ? AND user = ?", [guildId, userId]],
		["SELECT author, warn AS id, reason, date FROM warn WHERE guild = ? AND user = ?", [guildId, userId]],
		["SELECT author, mute AS id, reason, date, time FROM mute WHERE guild = ? AND user = ?", [guildId, userId]],
		["SELECT author, kick AS id, reason, date FROM kick WHERE guild = ? AND user = ?", [guildId, userId]],
		["SELECT author, ban AS id, reason, date, time FROM ban WHERE guild = ? AND user = ?", [guildId, userId]],
		["SELECT sanctionID, sanction_type, expired FROM sanctions_list WHERE guildId = ? AND userID = ?", [guildId, userId]],
	];
	const [notes, warnings, timeouts, kicks, bans, sanctionRows] = await Promise.all(
		queries.map(query => bot.function.executeQuery(query, bot)),
	);
	const sanctions = [
		...notes.map(record => ({type: "Note", record})),
		...warnings.map(record => ({type: "Avertissement", record})),
		...timeouts.map(record => ({type: "Timeout", record})),
		...kicks.map(record => ({type: "Expulsion", record})),
		...bans.map(record => ({type: "Bannissement", record})),
	].sort((a, b) => (parseTimestamp(b.record.date) ?? 0) - (parseTimestamp(a.record.date) ?? 0));

	const authorIds = [...new Set(sanctions.map(({record}) => record.author).filter(Boolean).map(String))];
	const authors = await Promise.allSettled(authorIds.map(id => bot.users.fetch(id)));
	const users = new Map();
	authors.forEach((result, index) => {
		if (result.status === "fulfilled") users.set(authorIds[index], result.value);
	});
	const sanctionMetadata = new Map(sanctionRows.map(row => [
		String(row.sanctionID),
		{type: row.sanction_type, expired: Number(row.expired) === 1},
	]));

	return {sanctions, users, sanctionMetadata};
}

module.exports = {
	name: "sanctions-list",
	description: "Afficher les sanctions d'un membre.",
	permission: Discord.PermissionFlagsBits.ModerateMembers,
	category: "🛡・Modération",
	options: [
		{
			type: "user",
			name: "membre",
			description: "Le membre dont on veut voir les sanctions.",
			required: true,
			autocomplete: false
		}
	],

	async run(bot, message, args) {
		const user = args.getUser("membre");
		if (!user) return message.reply("Aucun membre sélectionné !");

		try {
			const guildId = message.guildId;
			const userId = user.id;
			const loading = new Discord.ContainerBuilder()
				.setAccentColor(parseInt(process.env.BOT_COLOR.replace("#", ""), 16))
				.addTextDisplayComponents(new Discord.TextDisplayBuilder().setContent("Chargement des sanctions…"));
			await message.reply({
				flags: Discord.MessageFlags.IsComponentsV2,
				components: [loading],
			});

			const {sanctions, users, sanctionMetadata} = await loadSanctionsData(bot, guildId, userId);

			if (sanctions.length === 0) {
				const empty = new Discord.ContainerBuilder()
					.setAccentColor(parseInt(process.env.BOT_COLOR.replace("#", ""), 16))
					.addTextDisplayComponents(
						new Discord.TextDisplayBuilder().setContent(`# __Sanctions de ${user.globalName ?? user.username}__`),
						new Discord.TextDisplayBuilder().setContent("Ce membre n'a aucune infraction enregistrée."),
					);
				return message.editReply({components: [empty]});
			}

			const pageCount = Math.ceil(sanctions.length / PAGE_SIZE);
			const page = 0;
			const container = buildSanctionsContainer(bot, user, message.user.id, sanctions, users, sanctionMetadata, page, pageCount);
			await message.editReply({
				allowedMentions: {parse: []},
				components: [container],
			});
		} catch (error) {
			bot.function.botLogsFile.error(`Impossible de récupérer les sanctions de ${user.id} sur le serveur ${message.guildId} :`, error);
			const errorContainer = new Discord.ContainerBuilder()
				.setAccentColor(parseInt(process.env.BOT_COLOR.replace("#", ""), 16))
				.addTextDisplayComponents(
					new Discord.TextDisplayBuilder().setContent("Impossible de récupérer la liste des sanctions pour le moment."),
				);
			return message.editReply({components: [errorContainer]});
		}
	},
	loadSanctionsData,
	buildSanctionsContainer,
	PAGE_SIZE,
}
