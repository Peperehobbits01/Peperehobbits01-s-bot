const Discord = require("discord.js");
const {getGuildConfig} = require("../Fonctions/guildConfig.js");

module.exports = async (bot, member) => {

	const config = await getGuildConfig(member.guild.id);

	const welcomeChannel = member.guild.channels.cache.get(config.welcomeChannel)
	if (welcomeChannel) {
		welcomeChannel.send(`Bienvenue à ${member}, il vient d'arrivée sur le serveur!`).catch(() => {});
	}

	const logsChannel = member.guild.channels.cache.get(config.logsChannelGateway)

	const logsNewMember = new Discord.EmbedBuilder()
		.setColor(process.env.BOT_COLOR)
		.setAuthor({
			name: member.displayName,
			iconURL: member.displayAvatarURL({dynamic: true})
		})
		.setDescription(`${member} a rejoint le serveur.\nUtilisateur : ${member.displayName}\nPlus d'info : https://discord.com/channels/${member.guild.id}/member-safety\n\n**ID** :\n\nUtilisateur : ${member.id}`)
		.setFooter({
			text: process.env.EMBED_FOOTER,
			iconURL: bot.user.displayAvatarURL({dynamic: true})
		})
		.setTimestamp()

	if (logsChannel) {
		await logsChannel.send({embeds: [logsNewMember]})
	}
}
