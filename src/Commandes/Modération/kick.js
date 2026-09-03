const Discord = require("discord.js")
const {executeQuery} = require("../../Fonctions/databaseConnect.js")

module.exports = {

	name: "kick",
	description: "Expulser les personnes ne respectant pas les règles.",
	permission: Discord.PermissionFlagsBits.KickMembers,
	category: "🛡・Modération",
	options: [
		{
			type: "user",
			name: "membre",
			description: "Le membre à expulser.",
			required: true,
			autocomplete: false
		}, {
			type: "string",
			name: "raison",
			description: "La raison de l'expulsion.",
			required: true,
			autocomplete: false
		}
	],

	async run(bot, message, args) {

		let user = args.getUser("membre")
		if (!user) return message.reply("Aucun membre sélectionné !")
		let member = message.guild.members.cache.get(user.id)
		if (!member) return message.reply("Aucun membre a expulsé !")

		await message.deferReply()

		let reason = args.getString("raison")
		if (!reason) reason = "Non-respect du règlement ! (raison auto ajoutée)";

		if (message.user.id === user.id) return message.followUp("Tu ne peux pas t'expulser !")
		if ((await message.guild.fetchOwner()).id === user.id) return message.followUp("Le fondateur ne peut pas être expulsé !")
		if (member && !member.kickable) return message.followUp("Je ne peux pas l'expulser !")
		if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.followUp("Tu ne peux pas l'expulser !")

		try {
			const Kick1 = new Discord.EmbedBuilder()
				.setColor(process.env.BOT_COLOR)
				.setTitle(`Vous avez été expulsé !`)
				.setDescription(`${message.user.displayName} vous a expulsé sur le serveur ${message.guild.name} pour la raison : \`${reason}\` !`)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})

			await user.send({embeds: [Kick1]})
		} catch (err) {
		}

		await member.kick(reason)

		let ID = await bot.function.createId("KICK")

		const queryKickAdd = `INSERT INTO kick (guild, user, author, kick, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`
		await executeQuery(queryKickAdd)

		const Kick2 = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setTitle("Informations concernant l'expulsion.")
			.setDescription(`Vous avez expulsé ${user.tag} pour la raison : \`${reason}\` avec succès !`)
			.setFooter({
				text: process.env.EMBED_FOOTER,
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})

		await message.followUp({embeds: [Kick2]})
	}
}

