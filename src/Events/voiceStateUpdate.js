const Discord = require("discord.js");
const {voiceCallXpCalculation, activeTimers} = require("../Fonctions/voiceCallXpCalculation");

module.exports = async (bot, oldState, newState) => {

	const oldChannel = oldState.channel;
	const newChannel = newState.channel;
	const logsChannel = oldState.guild.channels.cache.get(process.env.LOGS_CHANNEL_VOICE);

	const member = newState.guild.members.cache.get(newState.id);
	if(!member) {
		console.warn("Le membre qui a un changement de statut vocal n'a pas pu être trouver.");
		return;
	}

	if(!oldChannel && newChannel) {

		await voiceCallXpCalculation(null, newChannel, newState, oldState, member)

		const JoinCall = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setTitle(`${member.displayName} a rejoint un salon vocal`)
			.setDescription(`Salon: ${newChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${newChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)
			.setFooter({
				text: process.env.EMBED_FOOTER,
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})
			.setTimestamp()
			.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

		await logsChannel.send({embeds: [JoinCall]})
	}

	if(oldChannel && !newChannel) {

		const oldTimer = activeTimers.get(member.id);
		if (oldTimer) { clearInterval(oldTimer); activeTimers.delete(member.id); }

		const LeaveCall = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setTitle(`${member.displayName} a quittée un salon vocal`)
			.setDescription(`Salon: ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)
			.setFooter({
				text: process.env.EMBED_FOOTER,
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})
			.setTimestamp()
			.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

		await logsChannel.send({embeds: [LeaveCall]})
	}

	if(oldChannel && newChannel) {

		if(newState.selfDeaf === true && oldState.selfDeaf === false) {

			const oldTimer = activeTimers.get(member.id);
			if (oldTimer) { clearInterval(oldTimer); activeTimers.delete(member.id); }

			const IsNowSelfDeaf = new Discord.EmbedBuilder()
				.setColor(process.env.BOT_COLOR)
				.setTitle(`${member.displayName} c'est mis en sourdine`)
				.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})
				.setTimestamp()
				.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

			await logsChannel.send({embeds: [IsNowSelfDeaf]})
			return
		} else if (oldState.selfDeaf === true && newState.selfDeaf === false) {

			await voiceCallXpCalculation(null, newChannel, newState, oldState, member)

			const IsNoLongerSelfDeaf = new Discord.EmbedBuilder()
				.setColor(process.env.BOT_COLOR)
				.setTitle(`${member.displayName} a quitté le mode sourdine`)
				.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})
				.setTimestamp()
				.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

			await logsChannel.send({embeds: [IsNoLongerSelfDeaf]});
			return
		}

		if(newState.selfMute === true && oldState.selfMute === false) {

			const oldTimer = activeTimers.get(member.id);
			if (oldTimer) { clearInterval(oldTimer); activeTimers.delete(member.id); }

			const IsNowSelfMute = new Discord.EmbedBuilder()
				.setColor(process.env.BOT_COLOR)
				.setTitle(`${member.displayName} c'est muté`)
				.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})
				.setTimestamp()
				.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

			await logsChannel.send({embeds: [IsNowSelfMute]})
		} else if (oldState.selfMute === true && newState.selfMute === false) {

			await voiceCallXpCalculation(null, newChannel, newState, oldState, member)

			const IsNoLongerSelfMute = new Discord.EmbedBuilder()
				.setColor(process.env.BOT_COLOR)
				.setTitle(`${member.displayName} c'est démuté`)
				.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})
				.setTimestamp()
				.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

			await logsChannel.send({embeds: [IsNoLongerSelfMute]});
		}

		if(newState.serverDeaf === true && oldState.serverDeaf === false) {

			const oldTimer = activeTimers.get(member.id);
			if (oldTimer) { clearInterval(oldTimer); activeTimers.delete(member.id); }

			const IsNowDeaf = new Discord.EmbedBuilder()
				.setColor(process.env.BOT_COLOR)
				.setTitle(`${member.displayName} a été mis en sourdine`)
				.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})
				.setTimestamp()
				.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

			await logsChannel.send({embeds: [IsNowDeaf]})
		} else if (oldState.serverDeaf === true && newState.serverDeaf === false) {

			if(newState.serverMute === false && newState.selfMute === false) {
				await voiceCallXpCalculation(null, newChannel, newState, oldState, member)
			}

			const IsNoLongerDeaf = new Discord.EmbedBuilder()
				.setColor(process.env.BOT_COLOR)
				.setTitle(`${member.displayName} a été autorisé à quitter le mode sourdine`)
				.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})
				.setTimestamp()
				.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

			await logsChannel.send({embeds: [IsNoLongerDeaf]});
		}

		if(newState.serverMute === true && oldState.serverMute === false) {

			const oldTimer = activeTimers.get(member.id);
			if (oldTimer) { clearInterval(oldTimer); activeTimers.delete(member.id); }

			const IsNowMute = new Discord.EmbedBuilder()
				.setColor(process.env.BOT_COLOR)
				.setTitle(`${member.displayName} a été muté`)
				.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})
				.setTimestamp()
				.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

			await logsChannel.send({embeds: [IsNowMute]})
		} else if (oldState.serverMute === true && newState.serverMute === false) {

			await voiceCallXpCalculation(null, newChannel, newState, oldState, member)

			const IsNoLongerMute = new Discord.EmbedBuilder()
				.setColor(process.env.BOT_COLOR)
				.setTitle(`${member.displayName} a été démuté`)
				.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})
				.setTimestamp()
				.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

			await logsChannel.send({embeds: [IsNoLongerMute]});
		}

		if(!oldState.streaming && newState.streaming) {

			const StartStream = new Discord.EmbedBuilder()
				.setColor(process.env.BOT_COLOR)
				.setTitle(`${member.displayName} a commencé à streamer`)
				.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})
				.setTimestamp()
				.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

			await logsChannel.send({embeds: [StartStream]})
		} else if (oldState.streaming && !newState.streaming) {

			const EndStream = new Discord.EmbedBuilder()
				.setColor(process.env.BOT_COLOR)
				.setTitle(`${member.displayName} a coupé son stream`)
				.setDescription(`Salon : ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})
				.setTimestamp()
				.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

			await logsChannel.send({embeds: [EndStream]})
		}

		if(oldChannel !== newChannel) {

			const MooveCall = new Discord.EmbedBuilder()
				.setColor(process.env.BOT_COLOR)
				.setTitle(`${member.displayName} a changée de vocal`)
				.setDescription(`**Salon**: Il était dans le salon ${oldChannel.name} et maintenant il est dans ${newChannel}\nAncien salon : ${oldChannel}\nNouveau salon : ${newChannel.name}\nUtilisateur : ${member}\n\n**ID :**\n\nAncien Salon: \`\`\`${oldChannel.id}\`\`\`\nNouveau Salon: \`\`\`${newChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)
				.setFooter({
					text: process.env.EMBED_FOOTER,
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})
				.setTimestamp()
				.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

			await logsChannel.send({embeds: [MooveCall]})
		}
	}
};
