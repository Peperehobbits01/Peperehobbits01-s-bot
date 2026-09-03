const Discord = require("discord.js")
const ms = require("ms");
const {executeQuery} = require("../../Fonctions/databaseConnect");

module.exports = {

	name: "unmute",
	description: "Retirer la mise en muet d'un membre.",
	permission: Discord.PermissionFlagsBits.ModerateMembers,
	category: "🛡・Modération",
	options: [
		{
			type: "user",
			name: "membre",
			description: "Le membre à démute.",
			required: true,
			autocomplete: false
		}, {
			type: "string",
			name: "id",
			description: "L'ID de la mise en muet.",
			required: true,
			autocomplete: false
		}, {
			type: "string",
			name: "raison",
			description: "La raison du démute.",
			required: false,
			autocomplete: false
		}
	],

	async run(bot, message, args) {

		let user = args.getUser("membre");
		if (!user) return message.reply("Aucun membre sélectionné !")
		let member = message.guild.members.cache.get(user.id)
		if (!member) return message.reply("Aucun membre a démute !")

		let id = args.getString("id")
		if (!id) return message.reply("Veuillez entrer une ID valide !")

		let reason = args.getString("raison")
		if (!reason) reason = "Démute pour bonne conduite (raison auto ajouté)."

		if (!member.moderatable) return message.reply("Je ne peux pas le démute !")
		if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas le démute !")
		if (!member.isCommunicationDisabled()) return message.reply("Il n'est pas muet !")

		const querySearch = `SELECT * FROM mute WHERE guild = "${message.guild.id}" AND user = "${user.id}" AND mute = '${id}'`
		const results = await executeQuery(querySearch)
		if (results.length < 1) return message.reply('Aucune mise en silence pour ce membre/ID de mute.');

		const queryMuteRemove = `DELETE FROM mute WHERE guild = "${message.guild.id}" AND user = "${user.id}" AND mute = "${id}"`
		await executeQuery(queryMuteRemove)

		try {
			const Unmute1 = new Discord.EmbedBuilder()
				.setColor(process.env.BOT_COLOR)
				.setTitle(`Vous n'êtes plus muet.`)
				.setDescription(`${message.user.displayName} vous n'êtes plus muet sur le serveur ${message.guild.name} pour la raison : \`${reason}\` !`)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})

			await user.send({embeds: [Unmute1]})
		} catch (err) {
		}

		await message.deferReply()

		const Unmute2 = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setTitle("Informations concernant le retrait de la mise en muet.")
			.setDescription(`Vous avez déunmute ${user.displayName} pour la raison : \`${reason}\` avec succès !`)
			.setFooter({
				text: process.env.EMBED_FOOTER,
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})

		await message.followUp({embeds: [Unmute2]})

		await member.timeout(null, reason)
	}
}
