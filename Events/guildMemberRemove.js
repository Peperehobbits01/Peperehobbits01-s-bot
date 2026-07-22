const Discord = require("discord.js")
const {executeQuery} = require("../Fonctions/databaseConnect");

module.exports = async (bot, member) => {

	const logsChannel = member.guild.channels.cache.get(process.env.LOGS_CHANNEL_GATEWAY)

	const removeMember = new Discord.EmbedBuilder()
		.setColor(process.env.BOT_COLOR)
		.setAuthor({
			name: member.displayName,
			iconURL: member.displayAvatarURL({dynamic: true})
		})
		.setDescription(`Le membre ${member.username} vient de quitter le serveur.\n**ID** :\nUtilisateur : ${member.id}`)
		.setFooter({
			text: "Gérée par l'instance de Peperehobbits01's Bot",
			iconURL: bot.user.displayAvatarURL({dynamic: true})
		})
		.setTimestamp()

	if(member.username.startsWith("deleted")){
		const xpSystemSearch = `SELECT * FROM xp WHERE guild = '${member.guild.id}' AND user = '${member.id}'`
		const xpSystemResults = await executeQuery(xpSystemSearch)

		if(xpSystemResults.length > 0) {
			const removeUserFromXpSystem = `DELETE FROM xp WHERE guild = '${member.guild.id}' AND user = '${member.id}'`
			await executeQuery(removeUserFromXpSystem)
		}
	}

	await logsChannel.send({embeds: [removeMember]})
}
