const Discord = require("discord.js");
const {executeQuery} = require("../../Fonctions/databaseConnect")

module.exports = {
	name: "remove",
	description: "Retire de l'expérience à un membre",
	permission: Discord.PermissionFlagsBits.Administrator,
	category: "📊・Système d'expérience",
	options: [
		{
			type: "user",
			name: "membre",
			description: "Le membre dont vous souhaitez retirer de l'expérience.",
			required: true,
			autocomplete: false
		},
		{
			type: "string",
			name: "experience",
			description: "La quantité d'expérience que vous voulez retirer au membre sélectionné.",
			required: true,
			autocomplete: false
		}
	],

	async run(bot, message, args) {

		const member = args.getMember("membre")
		if (!member) return message.reply({content: "Aucun membre sélectionné !"})

		const xptoremove = parseInt(args.getString("experience"))
		if (!xptoremove) return message.reply({content: "Veuillez donner une quantité d'expérience à retirer au membre !"})

		await message.deferReply()

		const queryAddSearch = `SELECT * FROM xp WHERE guild = '${message.guildId}' AND user = '${member.id}'`
		const AddResults = await executeQuery(queryAddSearch)

		if (AddResults.length < 1) return message.followUp({content: "Ce membre n'est pas dans la base de donnée !"})

		let newXp    = parseInt(AddResults[0].xp);
		let newLevel = parseInt(AddResults[0].level);
		let newXpTotal = parseInt(AddResults[0].xptotal);

		let maxRemovable = newXp;
		for (let l = 1; l < newLevel; l++) {
			maxRemovable += Math.round(100 * Math.pow(1.25, l));
		}

		const actualRemoval = Math.min(xptoremove, maxRemovable);
		const wasCapped = xptoremove > maxRemovable;

		newXp -= actualRemoval;
		newXpTotal = Math.max(0, newXpTotal - actualRemoval);

		let levelsLost = 0;

		while (newXp < 0 && newLevel > 1) {
			newLevel--;
			newXp += Math.round(100 * Math.pow(1.25, newLevel));
			levelsLost++;
		}

		if (newXp < 0) newXp = 0;

		const queryUpdate = `UPDATE xp SET xp = '${newXp}', level = '${newLevel}', xptotal = '${newXpTotal}' WHERE guild = '${message.guildId}' AND user = '${member.id}'`;
		await executeQuery(queryUpdate);

		const succesRemoveEmbed = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setTitle("Retrait d'expérience réussi.")
			.setDescription(
				`Le membre ${member.user} a perdu **${actualRemoval} XP** et est maintenant au niveau **${newLevel}** (XP: ${newXp}).`
			);

		if (wasCapped) {
			succesRemoveEmbed.addFields({
				name: "⚠️ Retrait plafonné",
				value: `Le membre ne disposait que de ${maxRemovable} XP. Seule cette quantité a été retirée.`,
				inline: false
			});
		}

		succesRemoveEmbed
			.setFooter({
				text: process.env.EMBED_FOOTER,
				iconURL: bot.user.displayAvatarURL({ dynamic: true })
			})
			.setTimestamp();

		await message.followUp({ embeds: [succesRemoveEmbed] });
	}
};
