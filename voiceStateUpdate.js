const { EmbedBuilder } = require(`discord.js`);
const { log_channel } = require(`../config.json`);

module.exports = {
    name: 'voiceStateUpdate',
    execute(oldState, newState) {
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;

        if (oldChannel === newChannel) {
            return;
        }

        if (!oldChannel && newChannel) {
            console.log(`${newState.member.user.displayName} (${newState.member.user.id}) a rejoint le salon vocal ${newChannel.name}.`);
            const joinLog = new EmbedBuilder()
            .setColor(`#00FF00`)
            .setTitle(`Un membre vient de rejoint un salon vocal.`)
            .setDescription(`Salon: ${newChannel.name} \n Membre: ${newState.member.user.displayName} \n ID: ${newState.member.user.id}`)
            .setTimestamp();
            newState.guild.channels.cache.get(log_channel).send({embeds: [joinLog]});
        }
        if (oldChannel && !newChannel) {
            console.log(`${oldState.member.user.displayName} (${oldState.member.user.id}) a quitté le salon vocal ${oldChannel.name}.`);
            const leaveLog = new EmbedBuilder()
            .setColor(`#FF0000`)
            .setTitle(`Un membre vient de quitter un salon vocal.`)
            .setDescription(`Salon: ${oldChannel.name} \n Membre: ${oldState.member.user.displayName} \n ID: ${oldState.member.user.id}`)
            .setTimestamp();
            oldState.guild.channels.cache.get(log_channel).send({embeds: [leaveLog]});
        }
        if (oldChannel && newChannel) {
            console.log(`${newState.member.user.displayName} (${newState.member.user.id}) a changé de salon vocal. ${oldChannel.name} => ${newChannel.name}`);
            const switchLog = new EmbedBuilder()
            .setColor(`#00FF00`)
            .setTitle(`Un membre vient de changer de salon vocal.`)
            .setDescription(`Ancien Salon: ${oldChannel.name} \n Nouveau Salon: ${newChannel.name} \n Membre: ${newState.member.user.displayName} \n ID: ${newState.member.user.id}`)
            .setTimestamp();
            newState.guild.channels.cache.get(log_channel).send({embeds: [switchLog]});
        }  
    },
  };
  