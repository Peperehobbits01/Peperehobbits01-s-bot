const Discord = require("discord.js");
const {voiceCallXpCalculation, activeTimers} = require("../Fonctions/voiceCallXpCalculation");
const {getGuildConfig} = require("../Fonctions/guildConfig.js");

module.exports = async (bot, oldState, newState) => {

	const config = await getGuildConfig(bot, oldState.guild.id);
	const logsChannel = oldState.guild.channels.cache.get(config.logsChannelVoice)
	if(!logsChannel){
		return;
	}

	const member = newState.guild.members.cache.get(newState.id);
	if(!member) {
		bot.function.botLogsFile.warn("Le membre qui a un changement de statut vocal n'a pas pu être trouvé.");
		return;
	}

	const voiceStateUpdateEmbed = new Discord.EmbedBuilder()
		.setColor(process.env.BOT_COLOR)
		.setAuthor({
			name: member.displayName,
			iconURL: member.displayAvatarURL({dynamic: true})
		})
		.setFooter({
			text: process.env.EMBED_FOOTER,
			iconURL: bot.user.displayAvatarURL({dynamic: true})
		})
		.setTimestamp()

	if(!oldState.channel && newState.channel) {

		if(newState.selfDeaf === false && newState.selfMute === false && newState.serverMute === false &&	 newState.serverMute === false) {
			await voiceCallXpCalculation(null, newState.channel, newState, oldState, member, bot)
		}

		voiceStateUpdateEmbed.setTitle(`Un membre a rejoint un salon vocal.`)
		voiceStateUpdateEmbed.setDescription(`${member} a rejoint le salon ${newState.channel}.`)

		await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
	}

	if(oldState.channel && !newState.channel) {

		const oldTimer = activeTimers.get(member.id);
		if (oldTimer) { clearInterval(oldTimer); activeTimers.delete(member.id); }

		voiceStateUpdateEmbed.setTitle(`Un membre a quittée un salon vocal.`)
		voiceStateUpdateEmbed.setDescription(`${member} a quittée le salon ${oldState.channel}.`)

		await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
	}

	if(oldState.channel && newState.channel) {
		const fetchedLogs = await oldState.guild.fetchAuditLogs({
			type: Discord.AuditLogEvent.memberUpdate,
			limit: 2,
		});

		const channelLog = fetchedLogs.entries.find(entry =>
			entry.target?.id === oldState.id
		);

		const executor = channelLog?.executor;

		if(newState.selfDeaf === true && oldState.selfDeaf === false) {

			const oldTimer = activeTimers.get(member.id);
			if (oldTimer) { clearInterval(oldTimer); activeTimers.delete(member.id); }

			voiceStateUpdateEmbed.setTitle(`Un membre s'est mis en sourdine.`)
			voiceStateUpdateEmbed.setDescription(`${member} s'est mis en sourdine dans le salon ${oldState.channel}.`)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
			return
		} else if (oldState.selfDeaf === true && newState.selfDeaf === false) {

			await voiceCallXpCalculation(null, newState.channel, newState, oldState, member, bot)

			voiceStateUpdateEmbed.setTitle(`Un membre a quitté le mode sourdine.`)
			voiceStateUpdateEmbed.setDescription(`${member} a quitté le mode sourdine dans le salon ${oldState.channel}.`)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]});
			return
		}

		if(newState.selfMute === true && oldState.selfMute === false) {

			const oldTimer = activeTimers.get(member.id);
			if (oldTimer) { clearInterval(oldTimer); activeTimers.delete(member.id); }

			voiceStateUpdateEmbed.setTitle(`Un membre s'est rendu muet.`)
			voiceStateUpdateEmbed.setDescription(`${member} s'est rendu muet dans le salon ${oldState.channel}.`)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
		} else if (oldState.selfMute === true && newState.selfMute === false) {

			await voiceCallXpCalculation(null, newState.channel, newState, oldState, member, bot)

			voiceStateUpdateEmbed.setTitle(`Un membre s'est démuté.`)
			voiceStateUpdateEmbed.setDescription(`${member} s'est démuté dans le salon ${oldState.channel}.`)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]});
		}

		if(newState.serverDeaf === true && oldState.serverDeaf === false) {

			const oldTimer = activeTimers.get(member.id);
			if (oldTimer) { clearInterval(oldTimer); activeTimers.delete(member.id); }

			voiceStateUpdateEmbed.setTitle(`Un membre a été mis en sourdine.`)
			voiceStateUpdateEmbed.setDescription(`${member} a été mis en sourdine dans le salon ${oldState.channel} par ${executor}.`)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
		} else if (oldState.serverDeaf === true && newState.serverDeaf === false) {

			if(newState.serverMute === false && newState.selfMute === false) {
				await voiceCallXpCalculation(null, newState.channel, newState, oldState, member, bot)
			}

			voiceStateUpdateEmbed.setTitle(`Un membre a été autorisé à quitter le mode sourdine.`)
			voiceStateUpdateEmbed.setDescription(`${member} a été autorisé à quitter le mode sourdine dans le salon ${oldState.channel} par ${executor}.`)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]});
		}

		if(newState.serverMute === true && oldState.serverMute === false) {

			const oldTimer = activeTimers.get(member.id);
			if (oldTimer) { clearInterval(oldTimer); activeTimers.delete(member.id); }

			voiceStateUpdateEmbed.setTitle(`Un membre a été mis au silence.`)
			voiceStateUpdateEmbed.setDescription(`${member} a été mis au silence dans le salon ${oldState.channel} par ${executor}.`)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
		} else if (oldState.serverMute === true && newState.serverMute === false) {

			await voiceCallXpCalculation(null, newState.channel, newState, oldState, member, bot)

			voiceStateUpdateEmbed.setTitle(`Un membre a pu quitté le silence.`)
			voiceStateUpdateEmbed.setDescription(`${member} a pu quitté le silence dans le salon ${oldState.channel} par ${executor}`)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]});
		}

		if(!oldState.streaming && newState.streaming) {

			voiceStateUpdateEmbed.setTitle(`Un membre a commencé à stream.`)
			voiceStateUpdateEmbed.setDescription(`${member} a commencé à stream dans le salon ${oldState.channel}.`)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
		} else if (oldState.streaming && !newState.streaming) {

			voiceStateUpdateEmbed.setTitle(`Un membre a coupé son stream.`)
			voiceStateUpdateEmbed.setDescription(`${member} a coupé son stream dans le salon ${oldState.channel}`)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
		}

		if(oldState.channel !== newState.channel) {

			voiceStateUpdateEmbed.setTitle(`Un membre a changée de vocal.`)
			voiceStateUpdateEmbed.setDescription(`${member} est passée du salon ${oldState.channel.name} au salon ${newState.channel}`)

			await logsChannel.send({embeds: [voiceStateUpdateEmbed]})
		}
	}
};
