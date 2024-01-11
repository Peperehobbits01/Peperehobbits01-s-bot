const { EmbedBuilder } = require('discord.js');
const { log_channel } = require(`../config.json`);

module.exports = {
  name: 'guildMemberUpdate',
  description: `Événement lorsqu'un membre change son pseudo sur le serveur.`,
  execute(oldMember, newMember) {
    if (oldMember.displayName !== newMember.displayName) {
      console.log(`${oldMember.displayName} (${oldMember.id}) a changé son pseudo en ${newMember.displayName}.`);
      const nameLog = new EmbedBuilder()
		  .setColor(`#00FF00`)
		  .setTitle(`Un membre vient de changer son pseudo.`)
		  .setDescription(`Ancien: ${oldMember.displayName} \n Nouveau: ${newMember.displayName} \n ID: ${oldMember.id}`)
		  .setTimestamp();
		  oldMember.guild.channels.cache.get(log_channel).send({embeds: [nameLog]});
    }
  },
};
