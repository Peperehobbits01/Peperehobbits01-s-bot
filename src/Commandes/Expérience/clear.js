const Discord = require("discord.js");
const {executeQuery} = require("../../Fonctions/databaseConnect")

module.exports = {
	name: "clear",
	description: "Effacer l'expérience d'un membre",
	permission: Discord.PermissionFlagsBits.Administrator,
	category: "📊・Système d'expérience",
	options: [
		{
			type: "user",
			name: "membre",
			description: "Le membre à qui effacer son expérience.",
			required: true,
			autocomplete: false
		}
	],

	async run(bot, message, args) {

		const member = args.getMember("membre")
		if (!member) return message.reply({content: "Aucun membre sélectionné !"})

		await message.deferReply()

		const queryAllClearSearch = `SELECT * FROM xp WHERE guild = '${message.guildId}' AND user = '${member.id}'`
		const AllClearResults = await executeQuery(queryAllClearSearch)

		if (AllClearResults.length < 1) return message.followUp(`Le membre ${member.user.tag} n'est pas dans la base de donnée !`)

		const queryAllClear = `DELETE FROM xp WHERE guild = '${message.guildId}' AND user = '${member.id}'`
		await executeQuery(queryAllClear)

		const succesAllClear = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setTitle("Effacement du membre de la base de donnée réussie.")
			.setDescription(`Le membre ${member.user.tag} a bien été effacer de la base de donnée!`)
			.setFooter({
				text: "Gérée par l'instance de Peperehobbits01's Bot",
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})
			.setTimestamp()

		await message.followUp({embeds: [succesAllClear]})
	}
};
