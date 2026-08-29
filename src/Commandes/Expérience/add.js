const Discord = require("discord.js");
const {executeQuery} = require("../../Fonctions/databaseConnect")

module.exports = {
	name: "add",
	description: "Ajoute de l'expérience à un membre",
	permission: Discord.PermissionFlagsBits.Administrator,
	category: "📊・Système d'expérience",
	options: [
		{
			type: "user",
			name: "membre",
			description: "Le membre à qui vous souhaitez donner de l'expérience.",
			required: true,
			autocomplete: false
		},
		{
			type: "string",
			name: "experience",
			description: "La quantité d'expérience que vous voulez donner au membres sélectionner.",
			required: true,
			autocomplete: false
		}
	],

	async run(bot, message, args) {

		const member = args.getMember("membre")
		if (!member) return message.reply({content: "Aucun membre sélectionné !"})

		const xptogive = parseInt(args.getString("experience"))
		if (!xptogive) return message.reply({content: "Veuillez donner une quantité d'expérience à donner au membre !"})

		await message.deferReply()

		const queryAddSearch = `SELECT * FROM xp WHERE guild = '${message.guildId}' AND user = '${member.id}'`
		const AddResults = await executeQuery(queryAddSearch)

		let newXp, newLevel, newXpTotal, levelsGained = 0;

		if (AddResults.length < 1) {
			newXp = xptogive;
			newLevel = 1;
			newXpTotal = xptogive;

			while (newXp >= Math.round(100 * Math.pow(1.25, newLevel))) {
				newXp -= Math.round(100 * Math.pow(1.25, newLevel));
				newLevel++;
				levelsGained++;
			}

			const queryAdd = `INSERT INTO xp (guild, user, xp, level, xptotal) VALUES (${message.guildId}, '${member.id}', '${newXp}', '${newLevel}', '${newXpTotal}')`
			await executeQuery(queryAdd)

			if(Math.round(100 * Math.pow(1.25, 1)) <= xptogive) {
				let levelChannel = message.guild.channels.cache.get(process.env.LEVEL_PASS_CHANNEL);
				levelChannel.send(`Tu l'as fais ${member}, tu arrives au niveau ${newLevel}. Bien jouée à toi!`)
			}

		} else {
			newXp    = parseInt(AddResults[0].xp) + xptogive;
			const level = parseInt(AddResults[0].level);
			newLevel = parseInt(AddResults[0].level);
			newXpTotal = parseInt(AddResults[0].xptotal) + xptogive;

			while (newXp >= Math.round(100 * Math.pow(1.25, newLevel))) {
				newXp -= Math.round(100 * Math.pow(1.25, newLevel));
				newLevel++;
				levelsGained++;
			}

			const queryXpUpdate = `UPDATE xp SET xp = '${newXp}', xptotal = '${newXpTotal}', level = '${newLevel}' WHERE guild = '${message.guildId}' AND user = '${member.id}'`
			await executeQuery(queryXpUpdate)

			if(Math.round(100 * Math.pow(1.25, level)) <= xptogive) {
				let levelChannel = message.guild.channels.cache.get(process.env.LEVEL_PASS_CHANNEL);
				levelChannel.send(`Tu l'as fais ${member}, tu arrives au niveau ${newLevel}. Bien jouée à toi!`)
			}
		}

		const succesAddEmbed = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setTitle("Ajout d'experience au membre dans la base de donnée réussie.")
			.setDescription(`Le membre ${member.user} a reçu ${xptogive}xp !`)
			.setFooter({
				text: "Gérée par l'instance de Peperehobbits01's Bot",
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})
			.setTimestamp()

		await message.followUp({embeds: [succesAddEmbed]})
	}
};
