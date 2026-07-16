const Discord = require("discord.js");

module.exports = {
	name: "stop-giveaway",
	description: "Arrêter le giveaway",
	permission: Discord.PermissionFlagsBits.Administrator,
	category: "🎁・giveaway",
	options: [
		{
			name: "messageid",
			type: "string",
			description: "L'id du giveaway",
			required: true,
			autocomplete: false
		}
	],
	async run(bot, interaction, args) {
		let messageId = args.getString("messageid");
		let message = await interaction.channel.messages.fetch(messageId);

		await messageId.delete();
		await interaction.send("Le giveaway a été interrompue!");
	},
};
