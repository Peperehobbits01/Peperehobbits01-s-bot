const Discord = require("discord.js");
const {getGuildConfig} = require("../../Fonctions/guildConfig.js");

module.exports = {
	name: "report",
	description: "Envoyer un rapport à l'équipe.",
	permission: "Aucune",
	category: "🛡・Modération",

	async run(bot, message) {
		const reportInput = new Discord.TextInputBuilder()
			.setCustomId("sayreport")
			.setStyle(Discord.TextInputStyle.Paragraph)
			.setPlaceholder("Indiquez votre signalement ici.")
			.setRequired(true)
			.setMaxLength(4000);

		const reportLabel = new Discord.LabelBuilder()
			.setLabel("Que souhaitez-vous signaler ?")
			.setTextInputComponent(reportInput);

		const reportModal = new Discord.ModalBuilder()
			.setCustomId("report")
			.setTitle("Signaler un problème")
			.addTextDisplayComponents(
				new Discord.TextDisplayBuilder().setContent(
					"S'il s'agit d'un bug, vous pouvez [créer une issue sur GitHub](https://github.com/Peperehobbit01/Peperehobbits01-s-bot/issues/new?template=bug-report.yml).",
				),
			)
			.addLabelComponents(reportLabel);

		await message.showModal(reportModal);
	},
};
