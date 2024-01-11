const { EmbedBuilder } = require('discord.js');
const { log_channel } = require(`../config.json`);

module.exports = {
    name: `guildMemberRemove`,
    description: `Événement lorsqu'un membre quitte le serveur.`,
    async execute(member) {
        const user = member.user;
        console.log(`${user.displayName} (${member.id}) vient de quitter le serveur`);
        const leaveLog = new EmbedBuilder()
		.setColor(`#FF0000`)
		.setTitle(`Un membre vient de quitter le serveur. 👋`)
		.setDescription(`Membre: ${user.displayName} \n ID: ${member.id}`)
		.setTimestamp();
		member.guild.channels.cache.get(log_channel).send({embeds: [leaveLog]});
    }
}