const Discord = require("discord.js")
const {getGuildConfig, setGuildConfig} = require("../../Fonctions/guildConfig.js")
const {GUILD_CONFIG_SCHEMA} = require("../../Fonctions/defaultGuildConfig.js")

function formatValue(value) {
	if (value === null || value === undefined || value === "") return "_(vide)_"
	if (Array.isArray(value)) return value.length > 0 ? value.map((v) => `\`${v}\``).join(", ") : "_(vide)_"
	return `\`${value}\``
}

function buildListEmbed(config) {
	const embed = new Discord.EmbedBuilder()
		.setColor(process.env.BOT_COLOR)
		.setTitle("Configuration du serveur")
		.setDescription("Valeurs actuelles (commandes : /config cle:<key> valeur:<val>)")

	for (const [key, info] of Object.entries(GUILD_CONFIG_SCHEMA)) {
		embed.addFields({
			name: key,
			value: `**${formatValue(config[key])}**\n_${info.description}_`
		})
	}

	embed.setFooter({
		text: process.env.EMBED_FOOTER,
		iconURL: null,
	})

	return embed
}

module.exports = {
	name: "config",
	description: "Afficher ou modifier la configuration du serveur.",
	permission: "Aucune",
	category: "⚙️・Configuration",
	options: [
		{
			type: "string",
			name: "cle",
			description: "Clé de configuration à modifier (optionnel pour afficher toutes les valeurs).",
			required: false,
			autocomplete: true
		},
		{
			type: "string",
			name: "valeur",
			description: "Nouvelle valeur pour la clé (omettre pour réinitialiser).",
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

		await message.deferReply();

		const guildId = message.guildId;
		const cle = args.getString("cle");
		const valeur = args.getString("valeur");

		if (!cle) {
			const config = await getGuildConfig(guildId);
			return message.editReply({embeds: [buildListEmbed(config)]});
		}

		if (!GUILD_CONFIG_SCHEMA[cle]) {
			return message.editReply({
				content: `Clé inconnue : \`${cle}\`. Utilisez /config sans clé pour lister les clés disponibles.`,
				flags: [Discord.MessageFlags.Ephemeral]
			});
		}

		const changes = {
			[cle]: valeur === null ? (GUILD_CONFIG_SCHEMA[cle].type === "list" ? [] : null) : valeur
		};

		if (valeur === null) {
			return message.editReply({
				content: `Clé \`${cle}\` réinitialisée.`,
				flags: [Discord.MessageFlags.Ephemeral]
			});
		}

		try {
			const updated = await setGuildConfig(guildId, changes);

			return message.editReply({
				content: `Clé \`${cle}\` définie sur ${formatValue(updated[cle])}.`,
				flags: [Discord.MessageFlags.Ephemeral]
			});
		} catch (error) {
			return message.editReply({
				content: "Une erreur est survenue lors de la sauvegarde.",
				flags: [Discord.MessageFlags.Ephemeral]
			});
		}
	}
}
