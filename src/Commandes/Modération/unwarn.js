const Discord = require('discord.js');
const {executeQuery} = require('../../Fonctions/databaseConnect');

module.exports = {

	name: "unwarn",
	description: "Permet de supprimer un avertissement d'un membre",
	category: "🛡・Modération",
	permission: Discord.PermissionFlagsBits.ModerateMembers,
	options: [
		{
			type: "user",
			name: "membre",
			description: "Le membre dont vous voulez souhaitez supprimer l'avertissement",
			required: true,
			autocomplete: false
		},
		{
			type: "string",
			name: "id",
			description: "ID du warn que vous voulez supprimer",
			required: true,
			autocomplete: false
		}

	],

	async run(bot, message, args) {

		let user = args.getUser("membre")
		if (!user) return message.reply('Aucun membre sélectionné !')
		let member = message.guild.members.cache.get(user.id);
		if (!member) return message.reply('Aucun membre sélectionné !')

		let id = args.getString("id")
		if (!id) return message.reply("Veuillez entrée une ID valide !")

		if (message.user.id === user.id) return message.reply('Vous ne pouvez pas supprimer vos avertissments !');
		if ((await message.guild.fetchOwner()).id === user.id) return message.reply('Vous ne pouvez pas supprimer les avertissements du propriétaire du serveur !');
		if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply('Tu ne peux pas supprimer les avertissements de ce membre !');
		if ((await message.guild.members.fetchMe()).roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply('Le bot ne peut pas supprimer les avertissements de ce membre !');

		const querySearch = `SELECT * FROM warn WHERE guild = "${message.guild.id}" AND user = "${user.id}" AND warn = '${id}'`
		const results = await executeQuery(querySearch)

		if (results.length < 1) return message.reply('Aucune avertissements pour ce membre/ID du warn');

		const queryWarnRemove = `DELETE FROM warn WHERE guild = "${message.guild.id}" AND user = "${user.id}" AND warn = "${id}"`
		await executeQuery(queryWarnRemove)

		try {
			const unwarn1 = new Discord.EmbedBuilder()
				.setTitle(`Un avertisement a été retirée! `)
				.setDescription(`${message.user.tag} vous a retirée un avertisement sur le serveur ${message.guild.name} ! `)
				.setColor(process.env.BOT_COLOR)
				.setFooter({
					text: "Gérée par l'instance de Peperehobbits01's Bot",
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})

			await user.send({embeds: [unwarn1]})
		} catch (err) {
		}

		await message.deferReply()

		const unwarn2 = new Discord.EmbedBuilder()
			.setTitle("Informations du retrait d'avertisement")
			.setDescription(`Vous avez retirée l'avertisement de ${user.tag} avec succès !`)
			.setColor(process.env.BOT_COLOR)
			.setFooter({
				text: "Gérée par l'instance de Peperehobbits01's Bot",
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})

		await message.followUp({embeds: [unwarn2]})
	}
}
