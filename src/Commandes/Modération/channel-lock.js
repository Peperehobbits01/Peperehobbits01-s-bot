const Discord = require("discord.js")

module.exports = {
	name: "channel-lock",
	description: "Permet de fermer un salon",
	permission: Discord.PermissionFlagsBits.ManageChannels,
	category: "🛡・Modération",
	options: [
		{
			type: "channel",
			name: "salon",
			description: "le salon a fermer",
			required: true,
			autocomplete: false
		}, {
			type: "string",
			name: "raison",
			description: "la raison de la fermeture",
			required: false,
			autocomplete: false
		}
	],

	async run(bot, message, args) {
		let channel = await message.guild.channels.cache.get(args.getChannel("salon").id)
		if (!channel) return message.reply({content: `Le salon n'a pas été trouvé !`})
		let reason = args.getString('raison')
		if (!reason) reason = "Non respect de règle."

		await channel.permissionOverwrites.create(message.guild.roles.everyone, {
			SendMessages: false
		})

		let lockmessage = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setTitle("Ce salon vient d'être fermer !")
			.setDescription(`Ce salon a été fermé par ${message.user} pour la raison suivante : **${reason}**`)
			.setFooter({
				text: "Gérée par l'instance de Peperehobbits01's Bot",
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})
			.setTimestamp()

		await channel.send({embeds: [lockmessage]})

		let Lock = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setTitle("Inforamtion sur la fermeture du salon")
			.setDescription(`Réalisée: \`${message.user.username}\`\nRaison: \`${reason}\``)
			.setFooter({
				text: "Gérée par l'instance de Peperehobbits01's Bot",
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})

		await message.reply({embeds: [Lock]})
	}
}
