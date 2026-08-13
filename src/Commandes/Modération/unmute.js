const Discord = require("discord.js")
const ms = require("ms");
const {executeQuery} = require("../../Fonctions/databaseConnect");

module.exports = {

	name: "unmute",
	description: "Demute un membre",
	permission: Discord.PermissionFlagsBits.ModerateMembers,
	category: "🛡・Modération",
	options: [
		{
			type: "user",
			name: "membre",
			description: "Le membre à demute",
			required: true,
			autocomplete: false
		}, {
			type: "string",
			name: "id",
			description: "L'ID du mute",
			required: true,
			autocomplete: false
		}, {
			type: "string",
			name: "raison",
			description: "La raison du demute",
			required: false,
			autocomplete: false
		}
	],

	async run(bot, message, args) {

		let user = args.getUser("membre");
		if (!user) return message.reply("Aucun membre sélectionnée !")
		let member = message.guild.members.cache.get(user.id)
		if (!member) return message.reply("Aucun membre sélectionnée !")

		let id = args.getString("id")
		if (!id) return message.reply("Veuillez entrée une ID valide !")

		let reason = args.getString("raison")
		if (!reason) reason = "Demute pour bonne conduite (raison auto ajouté)."

		if (!member.moderatable) return message.reply("Je ne peux pas le demute !")
		if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas le demute !")
		if (!member.isCommunicationDisabled()) return message.reply("Il n'est pas mute !")

		const querySearch = `SELECT * FROM mute WHERE guild = "${message.guild.id}" AND user = "${user.id}" AND mute = '${id}'`
		const results = await executeQuery(querySearch)
		if (results.length < 1) return message.reply('Aucune mise en silence pour ce membre/ID du mute.');

		const queryMuteRemove = `DELETE FROM mute WHERE guild = "${message.guild.id}" AND user = "${user.id}" AND mute = "${id}"`
		await executeQuery(queryMuteRemove)

		try {
			const Unmute1 = new Discord.EmbedBuilder()
				.setTitle(`Vous avez été retirée du silence ! `)
				.setDescription(`${message.user.tag} vous a retirée du silence sur le serveur ${message.guild.name} pour la raison : \`${reason}\` ! `)
				.setColor(process.env.BOT_COLOR)
				.setFooter({
					text: "Gérée par l'instance de Peperehobbits01's Bot",
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})

			await user.send({embeds: [Unmute1]})
		} catch (err) {
		}

		await message.deferReply()

		const Unmute2 = new Discord.EmbedBuilder()
			.setTitle("Informations du unmute")
			.setDescription(`Vous avez unmute ${user.tag} pour la raison : \`${reason}\` avec succès !`)
			.setColor(process.env.BOT_COLOR)
			.setFooter({
				text: "Gérée par l'instance de Peperehobbits01's Bot",
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})

		await message.followUp({embeds: [Unmute2]})

		await member.timeout(null, reason)
	}
}
