const Discord = require("discord.js");
const {getGuildConfig} = require("../Fonctions/guildConfig.js");

module.exports = async (bot, member) => {

	const config = await getGuildConfig(bot, member.guild.id);
	const logsChannel = member.guild.channels.cache.get(config.logsChannelGateway)
	const welcomeChannel = member.guild.channels.cache.get(config.welcomeChannel)
	if (welcomeChannel) {
		welcomeChannel.send(`Bienvenue à ${member}, il vient d'arrivée sur le serveur!`).catch(() => {});
	}

	if (logsChannel) {
		const logsNewMember = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setAuthor({
				name: member.displayName,
				iconURL: member.displayAvatarURL({dynamic: true})
			})
			.setTitle("Une personne vient de rejoindre le serveur.")
			.setDescription(`${member} a rejoint le serveur.\nPlus d'info disponible : https://discord.com/channels/${member.guild.id}/member-safety`)
			.setFooter({
				text: process.env.EMBED_FOOTER,
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})
			.setTimestamp()

		await logsChannel.send({embeds: [logsNewMember]})
	}
}
