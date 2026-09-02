const Discord = require("discord.js")
const {executeQuery} = require("../../Fonctions/databaseConnect.js")
const ms = require("ms");

module.exports = {

	name: "ban",
	description: "Permet de bannir les personnes ne respectant pas les règles.",
	permission: Discord.PermissionFlagsBits.BanMembers,
	category: "🛡・Modération",
	options: [
		{
			type: "user",
			name: "membre",
			description: "Le membre à bannir",
			required: true,
			autocomplete: false
		}, {
			type: "string",
			name: "raison",
			description: "La raison du bannissement",
			required: true,
			autocomplete: false
		}, {
			type: "string",
			name: "temps",
			description: "La temps du bannissement",
			required: false,
			autocomplete: false
		}
	],

	async run(bot, message, args) {

		let user = args.getUser("membre")
		if (!user) return message.reply("Aucun membre a bannir !")
		let member = message.guild.members.cache.get(user.id)

		let reason = args.getString("raison")
		if (!reason) reason = "Non-respect du règlement! (raison auto ajoutée)";

		let time = args.getString("temps")
		if (!time) time = null

		if (message.user.id === user.id) return message.reply("Tu ne peux pas te bannir !")
		if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Le fondateur ne peut pas être banni !")
		if (member && !member.bannable) return message.reply("Je ne peux le bannir !")
		if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas le bannir !")
		if ((await message.guild.bans.fetch()).get(member)) return message.reply("Il est déjà banni !")

		if (time !== null) {
			if(isNaN(time)) return message.reply("La valeur entrée n'est pas un nombre.")
		}

		try {
			const Ban1 = new Discord.EmbedBuilder()
				.setTitle(`Vous avez été banni ! `)
				.setDescription(`${message.user.tag} vous a banni sur le serveur ${message.guild.name} pour la raison suivante : \`${reason}\` ! `)
				.setColor(process.env.BOT_COLOR)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})

			if (time !== null) {
				Ban1.addFields([{
					name: `Ce banissement est temporaire, et durera jusque ${ms(time)}`
				}])
			}

			await user.send({embeds: [Ban1]})
		} catch (err) {
		}

		await message.deferReply()

		let ID = await bot.function.createId("BAN")

		const queryBanAdd = `INSERT INTO ban (guild, user, author, ban, reason, date, time)
		                     VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}',
		                             '${reason.replace(/'/g, "\\'")}', '${Date.now()}', '${Date.now + time}')`
		await executeQuery(queryBanAdd)

		await message.guild.bans.create(user.id, {reason: reason})

		const unban = new Discord.ActionRowBuilder()
			.addComponents(
				new Discord.ButtonBuilder()
					.setCustomId(`unban_${ID}`)
					.setLabel("Retiré le bannisement")
					.setStyle(Discord.ButtonStyle.Danger)
			)

		const Ban2 = new Discord.EmbedBuilder()
			.setTitle("Informations du ban")
			.setDescription(`Vous avez banni ${user} pour la raison : \`${reason}\` avec succès !`)
			.setColor(process.env.BOT_COLOR)
			.setFooter({
				text: process.env.EMBED_FOOTER,
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})

		if (time !== null) {
			Ban2.addFields([{
				name: `Ce banissement est temporaire, et durera jusque ${ms(time)}`
			}])
		}

		await message.followUp({embeds: [Ban2], components: [unban]})
	}
}
