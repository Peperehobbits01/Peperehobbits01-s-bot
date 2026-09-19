const Discord = require("discord.js")
const {executeQuery} = require("../Fonctions/databaseConnect");
const {getGuildConfig} = require("../Fonctions/guildConfig.js");

module.exports = async (bot, member) => {

	const config = await getGuildConfig(member.guild.id);
	const logsChannel = member.guild.channels.cache.get(config.logsChannelGateway)

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
		const xpSystemSearch = `SELECT * FROM xp WHERE guild = '${member.guild.id}' AND user = '${member.id}'`
		const xpSystemResults = await executeQuery(xpSystemSearch)

		if(xpSystemResults.length > 0) {
			const removeUserFromXpSystem = `DELETE FROM xp WHERE guild = '${member.guild.id}' AND user = '${member.id}'`
			await executeQuery(removeUserFromXpSystem)
		}
	}

	if (logsChannel) {
		await logsChannel.send({embeds: [removeMember]})
	}
}
