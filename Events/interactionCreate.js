const Discord = require("discord.js")
const {executeQuery} = require("../Fonctions/databaseConnect.js")

module.exports = async (bot, interaction) => {

	if (interaction.type === Discord.InteractionType.ApplicationCommand) {

		const command = bot.commands.get(interaction.commandName);
		command.run(bot, interaction, interaction.options, bot.db)

	}

	if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {

		let entry = interaction.options.getFocused()

		if (interaction.commandName === "help") {

			let choices = bot.commands.filter(cmd => cmd.name.includes(entry))
			await interaction.respond(entry === "" ? bot.commands.map(cmd => ({
				name: cmd.name,
				value: cmd.name
			})) : choices.map(choices => ({name: choices.name, value: choices.name})))
		}

		if (interaction.commandName === "set-statut") {

			let choices = ["Listening", "Watching", "Playing", "Streaming", "Competing"]
			let sortie = choices.filter(c => c.includes(entry))
			await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({
				name: c,
				value: c
			})))
		}

		if (interaction.commandName === "addxp") {

			let choices = ["Level", "Xp"]
			let sortie = choices.filter(c => c.includes(entry))
			await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({
				name: c,
				value: c
			})))
		}

		if (interaction.commandName === "clearxp") {

			let choices = ["Level", "Xp", "Tout effacer"]
			let sortie = choices.filter(c => c.includes(entry))
			await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({
				name: c,
				value: c
			})))
		}

	}

	if (interaction.isButton()) {
		if (interaction.customId.startsWith("unnote_")) {

			const noteID = interaction.customId.split("_")[1];

			const member = await interaction.guild.members.fetch(interaction.user.id);
			if (!member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({
				content: "Vous ne pouvez pas utiliser ce bouton !",
				flags: [Discord.MessageFlags.Ephemeral]
			});

			const queryUnnoteSearch = `SELECT *
			                           FROM note
			                           WHERE guild = "${interaction.guild.id}"
				                         AND author = "${interaction.user.id}"
				                         AND note = "${noteID}"`
			const ResultsUnnote = await executeQuery(queryUnnoteSearch)
			if (ResultsUnnote.length < 1) return interaction.reply({
				content: "Aucune note trouvé pour ce membre",
				flags: [Discord.MessageFlags.Ephemeral]
			})

			const queryUnnoteDelete = `DELETE
			                           FROM note
			                           WHERE guild = "${interaction.guild.id}"
				                         AND author = "${interaction.user.id}"
				                         AND note = "${noteID}"`
			await executeQuery(queryUnnoteDelete)

			return interaction.reply({content: "Note retiré !", flags: [Discord.MessageFlags.Ephemeral]});
		}

		if (interaction.customId.startsWith("unwarn_")) {

			const warnId = interaction.customId.split("_")[1];

			const member = await interaction.guild.members.fetch(interaction.user.id);
			if (!member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({
				content: "Vous ne pouvez pas utiliser ce bouton !",
				flags: [Discord.MessageFlags.Ephemeral]
			});

			const queryUnwarnSearch = `SELECT *
			                           FROM warn
			                           WHERE guild = "${interaction.guild.id}"
				                         AND author = "${interaction.user.id}"
				                         AND warn = "${warnId}"`
			const ResultsUnwarn = await executeQuery(queryUnwarnSearch)
			if (ResultsUnwarn.length < 1) return interaction.reply({
				content: "Aucun avertissement trouvé pour ce membre",
				flags: [Discord.MessageFlags.Ephemeral]
			})

			const queryUnwarnDelete = `DELETE
			                           FROM warn
			                           WHERE guild = "${interaction.guild.id}"
				                         AND author = "${interaction.user.id}"
				                         AND warn = "${warnId}"`
			await executeQuery(queryUnwarnDelete)

			try {
				const Warn1 = new Discord.EmbedBuilder()
					.setTitle(`Un avertissement a été retiré ! `)
					.setDescription(`${interaction.user.tag} a retiré votre avertissement sur le serveur ${interaction.guild.name} pour la raison : \`Bonne conduite\` ! `)
					.setColor(process.env.BOT_COLOR)
					.setFooter({
						text: "Gérée par l'instance de Peperehobbits01's Bot",
						iconURL: bot.user.displayAvatarURL({dynamic: true})
					})

				await ResultsUnwarn[0].user.send({embeds: [Warn1]})
			} catch (err) {
			}

			return interaction.reply({content: "Avertissement retiré !", flags: [Discord.MessageFlags.Ephemeral]});
		}

		if (interaction.customId.startsWith("unmute_")) {

			const muteId = interaction.customId.split("_")[1];

			const member = await interaction.guild.members.fetch(interaction.user.id);
			if (!member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({
				content: "Vous ne pouvez pas utiliser ce bouton !",
				flags: [Discord.MessageFlags.Ephemeral]
			});

			const queryUnmuteSearch = `SELECT *
			                           FROM mute
			                           WHERE guild = "${interaction.guild.id}"
				                         AND author = "${interaction.user.id}"
				                         AND mute = "${muteId}"`
			const ResultsUnmute = await executeQuery(queryUnmuteSearch)
			if (ResultsUnmute.length < 1) return interaction.reply({
				content: "Aucun mute trouvé pour ce membre",
				flags: [Discord.MessageFlags.Ephemeral]
			})

			const queryUnmuteDelete = `DELETE
			                           FROM mute
			                           WHERE guild = "${interaction.guild.id}"
				                         AND author = "${interaction.user.id}"
				                         AND mute = "${muteId}"`
			await executeQuery(queryUnmuteDelete)

			const user = await interaction.guild.members.fetch(ResultsUnmute[0].user)

			await user.timeout(null)

			try {
				const Mute1 = new Discord.EmbedBuilder()
					.setTitle(`Vous avez été démute ! `)
					.setDescription(`${interaction.user.tag} vous a démute sur le serveur ${interaction.guild.name} pour la raison : \`Bonne conduite\` ! `)
					.setColor(process.env.BOT_COLOR)
					.setFooter({
						text: "Gérée par l'instance de Peperehobbits01's Bot",
						iconURL: bot.user.displayAvatarURL({dynamic: true})
					})

				await user.send({embeds: [Mute1]})
			} catch (err) {
			}

			return interaction.reply({content: "Mute retiré !", flags: [Discord.MessageFlags.Ephemeral]});
		}

		if (interaction.customId.startsWith("unban_")) {

			const banId = interaction.customId.split("_")[1];

			const member = await interaction.guild.members.fetch(interaction.user.id);
			if (!member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({
				content: "Vous ne pouvez pas utiliser ce bouton !",
				flags: [Discord.MessageFlags.Ephemeral]
			});

			const queryUnbanSearch = `SELECT *
			                          FROM ban
			                          WHERE guild = "${interaction.guild.id}"
				                        AND author = "${interaction.user.id}"
				                        AND ban = "${banId}"`
			const ResultsUnban = await executeQuery(queryUnbanSearch)
			if (ResultsUnban.length < 1) return interaction.reply({
				content: "Aucun ban trouvé pour ce membre",
				flags: [Discord.MessageFlags.Ephemeral]
			})

			const queryUnbanDelete = `DELETE
			                          FROM ban
			                          WHERE guild = "${interaction.guild.id}"
				                        AND author = "${interaction.user.id}"
				                        AND ban = "${banId}"`
			await executeQuery(queryUnbanDelete)

			const user = await interaction.guild.members.fetch(ResultsUnban[0].user)
			await interaction.guild.members.unban(user)

			try {
				const Ban1 = new Discord.EmbedBuilder()
					.setTitle(`Vous avez été débannis ! `)
					.setDescription(`${interaction.user.tag} vous a débanni du serveur ${interaction.guild.name} pour la raison suivante : \`Bonne conduite\` ! `)
					.setColor(process.env.BOT_COLOR)
					.setFooter({
						text: "Gérée par l'instance de Peperehobbits01's Bot",
						iconURL: bot.user.displayAvatarURL({dynamic: true})
					})

				await user.send({embeds: [Ban1]})
			} catch (err) {
			}

			return interaction.reply({content: "Ban retiré !", flags: [Discord.MessageFlags.Ephemeral]});
		}

		if (interaction.customId.startsWith("unban-")) {

			const banUser = interaction.customId.split("-")[1];

			const member = await interaction.guild.members.fetch(interaction.user.id);
			if (!member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({
				content: "Vous ne pouvez pas utiliser ce bouton !",
				flags: [Discord.MessageFlags.Ephemeral]
			});

			const queryUnbanSearch = `SELECT *
			                          FROM ban
			                          WHERE guild = "${interaction.guild.id}"
				                        AND author = "${interaction.user.id}"
				                        AND user = "${banUser}"`
			const ResultsUnban = await executeQuery(queryUnbanSearch)
			if (ResultsUnban.length < 1) return interaction.reply({
				content: "Aucun ban trouvé pour ce membre",
				flags: [Discord.MessageFlags.Ephemeral]
			})

			const queryUnbanDelete = `DELETE
			                          FROM ban
			                          WHERE guild = "${interaction.guild.id}"
				                        AND author = "${interaction.user.id}"
				                        AND user = "${banUser}"`
			await executeQuery(queryUnbanDelete)

			const user = await interaction.guild.members.fetch(ResultsUnban[0].user)
			await interaction.guild.members.unban(user)

			try {
				const Ban1 = new Discord.EmbedBuilder()
					.setTitle(`Vous avez été débannis ! `)
					.setDescription(`${interaction.user.tag} vous a débanni du serveur ${interaction.guild.name} pour la raison suivante : \`Bonne conduite\` ! `)
					.setColor(process.env.BOT_COLOR)
					.setFooter({
						text: "Gérée par l'instance de Peperehobbits01's Bot",
						iconURL: bot.user.displayAvatarURL({dynamic: true})
					})

				await user.send({embeds: [Ban1]})
			} catch (err) {
			}

			return interaction.reply({content: "Ban retiré !", flags: [Discord.MessageFlags.Ephemeral]});
		}
	}

	if (interaction.customId === "help") {
		if (interaction.isStringSelectMenu()) {

			const category = interaction.values[0];
			const categoryCommands = bot.commands.filter(command => command.category.toUpperCase() === category)
			const commandString = categoryCommands.map(command => `**${command.name}** : \`${command.description}\``).join('\n');

			const nouvelEmbed = new Discord.EmbedBuilder()
				.setTitle(`Commandes de la catégorie ${category.toLowerCase()}`)
				.setDescription(commandString)
				.setColor(process.env.BOT_COLOR)
				.setFooter({
					text: "Gérée par l'instance de Peperehobbits01's Bot",
					conURL: bot.user.displayAvatarURL({dynamic: true})
				})
				.setTimestamp()
				.setThumbnail(bot.user.displayAvatarURL({dynamic: true}))

			return interaction.update({embeds: [nouvelEmbed]});
		}
	}
}
