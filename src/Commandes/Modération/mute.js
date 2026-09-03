const Discord = require("discord.js")
const ms = require("ms")
const {executeQuery} = require("../../Fonctions/databaseConnect.js")

module.exports = {

	name: "mute",
	description: "Rendre muet un membre.",
	permission: Discord.PermissionFlagsBits.ModerateMembers,
	category: "🛡・Modération",
	options: [
		{
			type: "user",
			name: "membre",
			description: "Le membre a rendre muet.",
			required: true,
			autocomplete: false
		}, {
			type: "string",
			name: "temps",
			description: "Le temps de la mise en muet.",
			required: true,
			autocomplete: false
		}, {
			type: "string",
			name: "raison",
			description: "La raison de la mise en muet.",
			required: false,
			autocomplete: false
		}
	],

	async run(bot, message, args) {

		let user = args.getUser("membre")
		if (!user) return message.reply("Aucun membre sélectionné !")
		let member = message.guild.members.cache.get(user.id)
		if (!member) return message.reply("Aucun membre à rendre muet !")

		await message.deferReply()

		let time = args.getString("temps")
		if (!time) return message.followUp("Aucun temps donné !")
		if (isNaN(ms(time))) return message.followUp("Mauvais format !")
		if (ms(time) > 2419200000) return message.followUp("Le robot ne peut pas rendre muet aussi longtemps !")
		if (ms(time) < 300000) return message.followUp("La durée de la mise en muet est trop courte !")

		let reason = args.getString("raison")
		if (!reason) reason = "Non-respect des règles (raison auto ajouté)";

		if (message.user.id === user.id) return message.followUp("Tu ne peux pas te rendre muet !")
		if ((await message.guild.fetchOwner()).id === user.id) return message.followUp("Tu ne peux pas rendre muet le fondateur !")
		if (!member.moderatable) return message.followUp("Je ne peux pas le rendre muet !")
		if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.followUp("Tu ne peux pas le rendre muet !")
		if (member.isCommunicationDisabled()) return message.followUp("Il est déjà rendu muet !")

		try {
			const Mute1 = new Discord.EmbedBuilder()
				.setColor(process.env.BOT_COLOR)
				.setTitle(`Vous avez été rendu muet !`)
				.setDescription(`${message.user.displayName} vous a rendu muet sur le serveur ${message.guild.name} pour la raison : \`${reason.replace(/'/g, "\\'")}\`, et il durera :  \`${time}\` !`)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})

			await user.send({embeds: [Mute1]})
		} catch (err) {
		}

		let ID = await bot.function.createId("MUTE")

		const queryMuteAdd = `INSERT INTO mute (guild, user, author, mute, reason, date, time)
		                      VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason}',
		                              '${Date.now()}', '${time}')`
		await executeQuery(queryMuteAdd)

		await member.timeout(ms(time), reason)

		const unmute = new Discord.ActionRowBuilder()
			.addComponents(
				new Discord.ButtonBuilder()
					.setCustomId(`unmute_${ID}`)
					.setLabel("Retiré la mise en muet")
					.setStyle(Discord.ButtonStyle.Danger)
			)

		const Mute2 = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setTitle("Informations concernant la mise en muet.")
			.setDescription(`Vous avez rendu muet ${user.displayName} pour la raison : \`${reason}\` et le temps : \`${time}\` avec succès !`)
			.setFooter({
				text: process.env.EMBED_FOOTER,
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})

		await message.followUp({embeds: [Mute2], components: [unmute]})
	}
}
