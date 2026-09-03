const Discord = require("discord.js");
const ms = require('ms');
const {executeQuery} = require("../../Fonctions/databaseConnect");
const {shuffleArray} = require("../../Fonctions/shuffleArray");

module.exports = {
	name: 'giveaway',
	description: 'Lancer un giveaway.',
	permission: Discord.PermissionFlagsBits.Administrator,
	category: "🎁・giveaway",
	options: [
		{
			name: 'duration',
			type: 'string',
			description: 'Combien de temps dure le giveaway ?',
			required: true,
			autocomplete: false
		},
		{
			name: 'winners',
			type: 'integer',
			description: 'Le nombre de gagnants.',
			required: true,
			autocomplete: false
		},
		{
			name: 'prize',
			type: 'string',
			description: 'Le prix du giveaway.',
			required: true,
			autocomplete: false
		},
	],
	async run(bot, message, args) {
		let duration = args.getString('duration');
		let winners = args.getInteger('winners');
		let prize = args.getString('prize');
		if(!duration) return message.reply("Aucun temps donné !")
		if(isNaN(ms(duration))) return message.reply("Mauvais format !")
		let durationMs = ms(duration)
		let endTime = Math.floor(Date.now() + durationMs)
		let ID = await bot.function.createId("GIVEAWAY")

		const offerButton = new Discord.ActionRowBuilder()
			.addComponents(
				new Discord.ButtonBuilder()
					.setCustomId(`giveaway_${ID}`)
					.setLabel("Participer")
					.setEmoji('🎉')
					.setStyle(Discord.ButtonStyle.Success)
			)

		const offrir = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setTitle(`Giveaway: ${prize}`)
			.setDescription(`Cliquez sur le bouton pour participer !\nDurée : <t:${Math.floor(endTime / 1000)}:R>\nNombre de gagnants : ${winners}`)
			.setFooter({
				text: process.env.EMBED_FOOTER,
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})
			.setTimestamp(endTime)

		const interaction = await message.reply({embeds: [offrir], components: [offerButton]})

		setTimeout(async () => {

			try {
				const contestantQuery = `SELECT * FROM giveaway WHERE guild = '${message.guild.id}' AND id = '${ID}'`;
				const contestantResults = await executeQuery(contestantQuery);

				if (contestantResults.length < winners) {
					const failedEmbed = new Discord.EmbedBuilder()
						.setColor(process.env.BOT_COLOR)
						.setTitle(`Giveaway: ${prize}`)
						.setDescription(`Il n'y a pas assez de participants pour déterminer les gagnants.`)
						.setFooter({
							text: process.env.EMBED_FOOTER,
							iconURL: bot.user.displayAvatarURL({dynamic: true})
						})
						.setTimestamp(endTime)

					await interaction.edit({embeds: [failedEmbed], components: []});
					return;
				}

				const unshuffled = contestantResults.map(x => x.user);
				const shuffledUsers = shuffleArray(unshuffled).slice(0, winners);

				for (let i = 0; i < winners; i++) {
					const winnerList = await bot.users.fetch(shuffledUsers[i])

					const successEmbed = new Discord.EmbedBuilder()
						.setColor('#36ff00')
						.setTitle(`Giveaway: ${prize}`)
						.setDescription(`Félicitations ${winnerList} ! Vous avez gagné ${prize} ! Si vous ne venez pas récupérer votre récompense sous 24 h, le cadeau sera remis en jeu !`)
						.setFooter({
							text: process.env.EMBED_FOOTER,
							iconURL: bot.user.displayAvatarURL({dynamic: true})
						})
						.setTimestamp(endTime)

					const RerollButton = new Discord.ActionRowBuilder()
						.addComponents(
							new Discord.ButtonBuilder()
								.setCustomId(`reroll_button_${ID}_${winners}_${endTime}_${prize}`)
								.setLabel("Reroll")
								.setStyle(Discord.ButtonStyle.Danger)
						)

					await interaction.edit({embeds: [successEmbed], components: [RerollButton]});
				}
			} catch {}
		}, ms(duration));
	},
};
