const Discord = require("discord.js")
const {getGuildConfig} = require("../Fonctions/guildConfig.js");

module.exports = async (bot, member) => {

	const config = await getGuildConfig(bot, member.guild.id);
	const logsChannel = member.guild.channels.cache.get(config.logsChannelGateway)
	if (!logsChannel) return;

	const removeMember = new Discord.EmbedBuilder()
		.setColor(process.env.BOT_COLOR)
		.setAuthor({
			name: member.displayName,
			iconURL: member.displayAvatarURL({dynamic: true})
		})
		.setDescription(`Le membre ${member.displayName} vient de quitter le serveur.\n**ID** :\nUtilisateur : ${member.id}`)
		.setFooter({
			text: process.env.EMBED_FOOTER,
			iconURL: bot.user.displayAvatarURL({dynamic: true})
		})
		.setTimestamp()

	if(member.displayName.startsWith("deleted")){
		const xpSystemResults = await bot.function.executeQuery(`SELECT * FROM xp WHERE guild = '${member.guild.id}' AND user = '${member.id}'`, bot)

		if(xpSystemResults.length > 0) {
			await bot.function.executeQuery(`DELETE FROM xp WHERE guild = '${member.guild.id}' AND user = '${member.id}'`, bot)
		}
	}

	await logsChannel.send({embeds: [removeMember]})
}
