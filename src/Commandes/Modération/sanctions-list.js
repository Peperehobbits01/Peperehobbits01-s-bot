const Discord = require("discord.js")

const PAGE_SIZE = 10;

function parseTimestamp(value) {
	const timestamp = Number(value);
	return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null;
}

function formatReason(reason) {
	const value = String(reason ?? "Aucune raison fournie").replace(/`/g, "ˋ").trim();
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

function buildSanctionField(sanction, users, sanctionMetadata) {
	const {type, record} = sanction;
	const timestamp = parseTimestamp(record.date);
	const details = [
		`**Auteur :** ${formatAuthor(record.author, users)}`,
		`**ID :** \`${record.id}\``,
		`**Raison :** ${formatReason(record.reason)}`,
		`**Date :** ${timestamp ? `<t:${Math.floor(timestamp / 1000)}:f>` : "Inconnue"}`,
	];

	if (type === "Timeout" && record.time) {
		details.splice(3, 0, `**Durée :** ${record.time}`);
	}
	if (type === "Ban") {
		details.splice(3, 0, `**Statut :** ${formatBanStatus(record, sanctionMetadata)}`);
	}

	return {
		name: `${type} • ${record.id}`.slice(0, 256),
		value: details.join("\n").slice(0, 1024),
		inline: false,
	};
}

function buildEmbed(bot, user, sanctions, users, sanctionMetadata, page, pageCount) {
	const embed = new Discord.EmbedBuilder()
		.setColor(process.env.BOT_COLOR)
		.setTitle(`Infractions de ${user.globalName ?? user.username}`)
		.setThumbnail(user.displayAvatarURL({extension: "png", forceStatic: true}))
		.setDescription(`Total : **${sanctions.length}** infraction(s)`)
		.setTimestamp()
		.setFooter({
			text: `${process.env.EMBED_FOOTER} • Page ${page + 1}/${pageCount}`,
			iconURL: bot.user.displayAvatarURL({extension: "png"}),
		});

	for (const sanction of sanctions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)) {
		embed.addFields(buildSanctionField(sanction, users, sanctionMetadata));
	}

	return embed;
}

function buildPaginationRow(page, pageCount, targetId) {
	return new Discord.ActionRowBuilder().addComponents(
		new Discord.ButtonBuilder()
			.setCustomId(`sanctions-list:${targetId}:previous`)
			.setLabel("Précédent")
			.setStyle(Discord.ButtonStyle.Secondary)
			.setDisabled(page === 0),
		new Discord.ButtonBuilder()
			.setCustomId(`sanctions-list:${targetId}:next`)
			.setLabel("Suivant")
			.setStyle(Discord.ButtonStyle.Secondary)
			.setDisabled(page >= pageCount - 1),
	);
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

		await message.deferReply();

		try {
			const guildId = message.guildId;
			const userId = user.id;
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

			if (sanctions.length === 0) {
				return message.editReply(`${user} n'a aucune infraction enregistrée.`);
			}

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

			const pageCount = Math.ceil(sanctions.length / PAGE_SIZE);
			const page = 0;
			const components = pageCount > 1 ? [buildPaginationRow(page, pageCount, user.id)] : [];
			await message.editReply({
				allowedMentions: {parse: []},
				embeds: [buildEmbed(bot, user, sanctions, users, sanctionMetadata, page, pageCount)],
				components,
			});

			if (pageCount > 1) {
				const response = await message.fetchReply();
				const collector = response.createMessageComponentCollector({
					componentType: Discord.ComponentType.Button,
					time: 5 * 60 * 1000,
					filter: interaction => interaction.customId.startsWith(`sanctions-list:${user.id}:`),
				});
				let currentPage = page;

				collector.on("collect", async interaction => {
					if (interaction.user.id !== message.user.id) {
						return interaction.reply({
							content: "Seul la personne ayant demandé cette liste peut utiliser ces boutons.",
							flags: Discord.MessageFlags.Ephemeral,
						});
					}

					currentPage = interaction.customId.endsWith(":next")
						? Math.min(currentPage + 1, pageCount - 1)
						: Math.max(currentPage - 1, 0);
					try {
						await interaction.update({
							allowedMentions: {parse: []},
							embeds: [buildEmbed(bot, user, sanctions, users, sanctionMetadata, currentPage, pageCount)],
							components: [buildPaginationRow(currentPage, pageCount, user.id)],
						});
					} catch (error) {
						bot.function.botLogsFile.error(`Impossible d'afficher la page ${currentPage + 1} des sanctions de ${user.id} :`, error);
					}
				});

				collector.on("end", () => {
					message.editReply({components: []}).catch(error => {
						bot.function.botLogsFile.error(`Impossible de retirer la pagination des sanctions pour ${user.id} :`, error);
					});
				});
			}
		} catch (error) {
			bot.function.botLogsFile.error(`Impossible de récupérer les sanctions de ${user.id} sur le serveur ${message.guildId} :`, error);
			return message.editReply("Impossible de récupérer la liste des sanctions pour le moment.");
		}
	}
}
