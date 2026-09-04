const Discord = require("discord.js");
const {voiceCallXpCalculation, activeTimers} = require("../Fonctions/voiceCallXpCalculation");

module.exports = async (bot, oldState, newState) => {

	const oldChannel = oldState.channel;
	const newChannel = newState.channel;
	const logsChannel = oldState.guild.channels.cache.get(process.env.LOGS_CHANNEL_VOICE);

	const member = newState.guild.members.cache.get(newState.id);
	if(!member) {
		console.warn("Le membre qui a un changement de statut vocal n'a pas pu être trouvé.");
		return;
	}

	const voiceStateUpdateEmbed = new Discord.EmbedBuilder()
		.setColor(process.env.BOT_COLOR)
		.setFooter({
			text: process.env.EMBED_FOOTER,
			iconURL: bot.user.displayAvatarURL({dynamic: true})
		})
		.setTimestamp()
		.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

	if(!oldChannel && newChannel) {

		if(newState.selfDeaf === false && newState.selfMute === false && newState.serverMute === false &&	 newState.serverMute === false) {
			await voiceCallXpCalculation(null, newChannel, newState, oldState, member)
		}

		voiceStateUpdateEmbed.setTitle(`${member.displayName} a rejoint un salon vocal.`)
		voiceStateUpdateEmbed.setDescription(`Salon: ${newChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${newChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)

		await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
	}

	if(oldChannel && !newChannel) {

		const oldTimer = activeTimers.get(member.id);
		if (oldTimer) { clearInterval(oldTimer); activeTimers.delete(member.id); }

		voiceStateUpdateEmbed.setTitle(`${member.displayName} a quittée un salon vocal.`)
		voiceStateUpdateEmbed.setDescription(`Salon: ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)

		await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
	}

	if(oldChannel && newChannel) {

		if(newState.selfDeaf === true && oldState.selfDeaf === false) {

			const oldTimer = activeTimers.get(member.id);
			if (oldTimer) { clearInterval(oldTimer); activeTimers.delete(member.id); }

			voiceStateUpdateEmbed.setTitle(`${member.displayName} s'est mis en sourdine.`)
			voiceStateUpdateEmbed.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
			return
		} else if (oldState.selfDeaf === true && newState.selfDeaf === false) {

			await voiceCallXpCalculation(null, newChannel, newState, oldState, member)

			voiceStateUpdateEmbed.setTitle(`${member.displayName} a quitté le mode sourdine.`)
			voiceStateUpdateEmbed.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]});
			return
		}

		if(newState.selfMute === true && oldState.selfMute === false) {

			const oldTimer = activeTimers.get(member.id);
			if (oldTimer) { clearInterval(oldTimer); activeTimers.delete(member.id); }

			voiceStateUpdateEmbed.setTitle(`${member.displayName} s'est rendu muet.`)
			voiceStateUpdateEmbed.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
		} else if (oldState.selfMute === true && newState.selfMute === false) {

			await voiceCallXpCalculation(null, newChannel, newState, oldState, member)

			voiceStateUpdateEmbed.setTitle(`${member.displayName} s'est démuté.`)
			voiceStateUpdateEmbed.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]});
		}

		if(newState.serverDeaf === true && oldState.serverDeaf === false) {

			const oldTimer = activeTimers.get(member.id);
			if (oldTimer) { clearInterval(oldTimer); activeTimers.delete(member.id); }

			voiceStateUpdateEmbed.setTitle(`${member.displayName} a été mis en sourdine.`)
			voiceStateUpdateEmbed.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
		} else if (oldState.serverDeaf === true && newState.serverDeaf === false) {

			if(newState.serverMute === false && newState.selfMute === false) {
				await voiceCallXpCalculation(null, newChannel, newState, oldState, member)
			}

			voiceStateUpdateEmbed.setTitle(`${member.displayName} a été autorisé à quitter le mode sourdine.`)
			voiceStateUpdateEmbed.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]});
		}

		if(newState.serverMute === true && oldState.serverMute === false) {

			const oldTimer = activeTimers.get(member.id);
			if (oldTimer) { clearInterval(oldTimer); activeTimers.delete(member.id); }

			voiceStateUpdateEmbed.setTitle(`${member.displayName} a été muté.`)
			voiceStateUpdateEmbed.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
		} else if (oldState.serverMute === true && newState.serverMute === false) {

			await voiceCallXpCalculation(null, newChannel, newState, oldState, member)

			voiceStateUpdateEmbed.setTitle(`${member.displayName} a été démuté.`)
			voiceStateUpdateEmbed.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]});
		}

		if(!oldState.streaming && newState.streaming) {

			voiceStateUpdateEmbed.setTitle(`${member.displayName} a commencé à stream.`)
			voiceStateUpdateEmbed.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
		} else if (oldState.streaming && !newState.streaming) {

			voiceStateUpdateEmbed.setTitle(`${member.displayName} a coupé son stream.`)
			voiceStateUpdateEmbed.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
		}

		if(oldChannel !== newChannel) {

			voiceStateUpdateEmbed.setTitle(`${member.displayName} a changée de vocal.`)
			voiceStateUpdateEmbed.setDescription(`**Salon**: Il était dans le salon ${oldChannel.name} et maintenant il est dans ${newChannel}\nAncien salon : ${oldChannel}\nNouveau salon : ${newChannel.name}\nUtilisateur : ${member}\n\n**ID :**\n\nAncien Salon: \`\`\`${oldChannel.id}\`\`\`\nNouveau Salon: \`\`\`${newChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
		}
	}
};
