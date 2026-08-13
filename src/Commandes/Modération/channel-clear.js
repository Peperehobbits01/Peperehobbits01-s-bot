const Discord = require("discord.js")

module.exports = {

	name: "channel-clear",
	description: "Permet de supprimer des messages dans un salon",
	permission: Discord.PermissionFlagsBits.ManageMessages,
	category: "🛡・Modération",
	options: [
		{
			type: "number",
			name: "nombre",
			description: "Le nombre de message à supprimer",
			required: true,
			autocomplete: false
		}, {
			type: "channel",
			name: "salon",
			description: "Le salon ou effacer les messages",
			required: false,
			autocomplete: false
		}
	],

	async run(bot, message, args) {

		let channel = args.getChannel("salon")
		if (!channel) channel = message.channel;
		if (channel.id !== message.channel.id && !message.guild.channels.cache.get(channel.id)) return message.reply("Se salon n'existe pas!")

		let number = args.getNumber("nombre")
		if (parseInt(number) <= 0 || parseInt(number) > 100) return message.reply("Le bot n'est pas capable de gérer un aussi grand nombre de suppression !")

		await message.deferReply()

		try {

			await channel.bulkDelete(parseInt(number))
			await message.channel.send({content: `Les messages sont supprimés !`})

		} catch (err) {

			let messages = [...(await channel.messages.fetch()).filter(msg => !msg.interaction && (Date.now() - msg.createdAt) <= 1209600000).values()]
			if (message.length <= 0) return message.channel.send("Aucun message a supprimé !")
			await channel.bulkDelete(messages)

			await message.channel.send({content: `Je n'ai pas pu tout supprimé car certain message date de plus de 14 jours !`})
		}
	}
}
