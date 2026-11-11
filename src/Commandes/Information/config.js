const Discord = require("discord.js")
const {setGuildConfig} = require("../../Fonctions/guildConfig.js")
const {GUILD_CONFIG_CATEGORIES, GUILD_CONFIG_SCHEMA} = require("../../Enum/defaultGuildConfig.js")

function formatValue(value) {
	if (value === null || value === undefined || value === "") return "_(Aucune valeur)_"
	if (Array.isArray(value)) return value.length > 0 ? value.map((v) => `\`${v}\``).join(", ") : "_(Aucune valeur)_"
	return `\`${value}\``
}

module.exports = {
	name: "config",
	description: "Afficher ou modifier la configuration du serveur.",
	permission: Discord.PermissionFlagsBits.Administrator,
	category: "📚・Informations",
	options: [
		{
			type: "string",
			name: "cle",
			description: "Paramètres de la configuration à modifier (optionnel pour afficher toutes les valeurs).",
			required: false,
			autocomplete: true
		},
		{
			type: "string",
			name: "valeur",
			description: "Nouvelle valeur pour le paramètres (omettre pour réinitialiser).",
			required: false,
			autocomplete: false
		}
	],

	async run(bot, message, args) {

		if (message.guild?.ownerId !== message.user.id) {
			return message.reply({
				content: "Seul le propriétaire du serveur peut modifier la configuration.",
				flags: [Discord.MessageFlags.Ephemeral]
			});
		}

		const guildId = message.guildId;
		const cle = args.getString("cle");
		const valeur = args.getString("valeur");

		if (!cle) {
			const container = new Discord.ContainerBuilder()
				.setAccentColor(parseInt(process.env.BOT_COLOR.replace("#", ""), 16))
				.addSectionComponents(
					new Discord.SectionBuilder()
						.addTextDisplayComponents(
							new Discord.TextDisplayBuilder().setContent("# __Configuration du serveur__"),
							new Discord.TextDisplayBuilder().setContent(
								`Choisissez une catégorie pour afficher ses paramètres.\n\nCatégories : \`${GUILD_CONFIG_CATEGORIES.length}\`\nParamètres : \`${Object.keys(GUILD_CONFIG_SCHEMA).length}\``
							),
						)
						.setThumbnailAccessory(
							new Discord.ThumbnailBuilder().setURL(bot.user.displayAvatarURL({dynamic: true, extension: "png"}))
						)
				)
				.addTextDisplayComponents(
					new Discord.TextDisplayBuilder().setContent(
						"Pour modifier ou réinitialiser une valeur, utilisez `/config cle:<clé> valeur:<valeur>`."
					),
				)

			container
				.addSeparatorComponents(new Discord.SeparatorBuilder().setDivider(true).setSpacing(Discord.SeparatorSpacingSize.Small))
				.addActionRowComponents(
					new Discord.ActionRowBuilder().addComponents(
						new Discord.StringSelectMenuBuilder()
							.setCustomId("config-category")
							.setPlaceholder("Quelle catégorie de configuration souhaitez-vous voir ?")
							.addOptions(GUILD_CONFIG_CATEGORIES.map(({id, label}) => ({
								label,
								value: id,
							}))),
					),
				)

			await message.reply({
				flags: Discord.MessageFlags.IsComponentsV2,
				components: [container],
			});
			return;
		}

		await message.deferReply({flags: Discord.MessageFlags.Ephemeral});

		if (!GUILD_CONFIG_SCHEMA[cle]) {
			return message.editReply({
				content: `Paramètre inconnue : \`${cle}\`. Utilisez /config sans paramètre pour lister tous les paramètres disponibles.`,
				flags: [Discord.MessageFlags.Ephemeral]
			});
		}

		const changes = {
			[cle]: valeur === null ? (GUILD_CONFIG_SCHEMA[cle].type === "list" ? [] : null) : valeur
		};

		try {
			const updated = await setGuildConfig(bot, guildId, changes);

			if (valeur === null) {
				return message.editReply({
					content: `Paramètre \`${cle}\` réinitialisé.`,
					flags: [Discord.MessageFlags.Ephemeral]
				});
			}

			return message.editReply({
				content: `Paramètre \`${cle}\` définie sur ${formatValue(updated[cle])}.`,
				flags: [Discord.MessageFlags.Ephemeral]
			});
		} catch (error) {
			bot.function.botLogsFile.error(`Impossible d'enregistrer la configuration du serveur ${guildId} :`, error);
			return message.editReply({
				content: "Une erreur est survenue lors de la sauvegarde.",
				flags: [Discord.MessageFlags.Ephemeral]
			});
		}
	},
}
