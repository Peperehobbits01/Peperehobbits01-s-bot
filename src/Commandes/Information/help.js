const Discord = require('discord.js');
const {levenshteinDistance} = require('../../Fonctions/levenshteinDistance');
const permissionName = require('../../enum/permissionName');
const {TextDisplayBuilder, SeparatorSpacingSize} = require("discord.js");

module.exports = {

	name: "help",
	description: "Afficher les commandes du bot",
	permission: "Aucune",
	category: "📚・Informations",
	options: [
		{
			type: "string",
			name: "commande",
			description: "La commande dont vous voulez connaitre le fonctionnement.",
			required: false,
			autocomplete: true
		}
	],

	async run(bot, message, args) {

		const commande = args.getString('commande');

		if (!commande) {
			let categories = []
			let cat = []
			bot.commands.forEach(command => {
				if (!cat.includes(command.category)) cat.push(command.category)

				const categoriesExistante = categories.some(category => category.value === command.category.toLowerCase() && category.label === command.category)

				if (!categoriesExistante) categories.push({
					label: command.category,
					value: command.category.toLowerCase()
				})
			})

			let commands = bot.commands.filter(command => {
				if (command.permission === "Aucune") {
					return true;
				} else {
					return message.member.permissions.has(command.permission);
				}
			});

			let commandCategories = []
			commands.forEach(command => {
				if (!commandCategories.includes(command.category)) {
					commandCategories.push(command.category)
				}
			})

			let menuOptions = []
			commandCategories.forEach(category => {
				menuOptions.push({label: category, value: category.toUpperCase()})
			})

			const containerHelp = new Discord.ContainerBuilder()
				.setAccentColor(parseInt(process.env.BOT_COLOR.replace('#', ''), 16))
				.addSectionComponents(
					new Discord.SectionBuilder()
						.addTextDisplayComponents(
							new TextDisplayBuilder().setContent("# __Bienvenue dans le menu d'aide.__"),
							new TextDisplayBuilder().setContent(`Voici le menu d'aide ! Vous n'avez qu'à cliquer sur la catégorie de commande correspondante et je serai ravi de vous aider ! **:warning: Je tiens à préciser que le menu d'aide affiche seulement les commandes auxquelles vous avez accès !**\n\nCatégories : \`${commandCategories.length}\`\nCommandes : \`${commands.size}\``)
						)
						.setThumbnailAccessory(
							new Discord.ThumbnailBuilder().setURL(bot.user.displayAvatarURL({dynamic: true, extension: "png"}))
						)
				)
				.addSeparatorComponents(new Discord.SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
				.addActionRowComponents(
					new Discord.ActionRowBuilder().addComponents(
						new Discord.StringSelectMenuBuilder()
							.setCustomId("help")
							.setPlaceholder("Quelle catégorie de commande souhaitez-vous voir ?")
							.addOptions(
							...menuOptions
							)
					)
				)

			message.reply({flags: Discord.MessageFlags.IsComponentsV2, components: [containerHelp]})

		} else {

			const commandes = []
			bot.commands.forEach(command => {
				commandes.push(command.name)
			})

			let minDistance = Number.MAX_SAFE_INTEGER;
			let commandeProche = "";

			commandes.forEach((word) => {
				const distance = levenshteinDistance(word, commande);

				if (distance < minDistance) {
					minDistance = distance;
					commandeProche = word;
				}
			});

			const command = bot.commands.get(commandeProche)
			if (!command) return message.reply({
				content: `Aucune commande correspondante à ${commande} n'a été trouvée !`,
				flags: [Discord.MessageFlags.Ephemeral]
			})

			const permissionsText = command.permission === "Aucune"
				? "Aucune"
				: new Discord.PermissionsBitField(command.permission).toArray().map(perm => permissionName[perm] || perm).join(', ')

			let containterCommande = new Discord.ContainerBuilder()
				.setAccentColor(parseInt(process.env.BOT_COLOR.replace('#', ''), 16))
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(`# __Commande ${command.name}__`),
				)
				.addSeparatorComponents(new Discord.SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(`> **Nom** : \`${command.name}\`\n> **Description** : \`${command.description}\`\n> **Permissions requises** : \`${permissionsText}\`\n> **Catégorie** : \`${command.category}\``)
				)

			await message.reply({flags: Discord.MessageFlags.IsComponentsV2, components: [containterCommande]})
		}
	}
}
