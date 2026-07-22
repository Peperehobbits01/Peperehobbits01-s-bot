const Discord = require("discord.js");
const ms = require("ms");
const {executeQuery} = require("../Fonctions/databaseConnect.js")

module.exports = async (bot, oldState, newState) => {

	const oldChannel = oldState.channel;
	const newChannel = newState.channel;
	const logsChannel = oldState.guild.channels.cache.get(process.env.LOGS_CHANNEL_VOICE);

	const member = newState.guild.members.cache.get(newState.id);
	if (!member) {
		console.warn("Le membre qui a un changement de statut vocal n'a pas pu être trouver.");
		return;
	}

	if (!oldChannel && newChannel) {

		const queryJoinCall = `INSERT INTO voicestateupdate (user, channel, time) VALUES ('${member.id}', '${newState.channel.id}', '0')`
		await executeQuery(queryJoinCall)

		const JoinCall = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setTitle(`${member.displayName} a rejoint un salon vocal`)
			.setDescription(`Salon: ${newChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${newChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)
			.setFooter({
				text: "Gérée par l'instance de Peperehobbits01's Bot",
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})
			.setTimestamp()
			.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

		await logsChannel.send({embeds: [JoinCall]})
	}

	if (oldChannel && !newChannel) {

		const queryLeaveCall = `DELETE FROM voicestateupdate WHERE channel = '${oldState.channel.id}' AND user = '${member.id}'`
		await executeQuery(queryLeaveCall)

		const LeaveCall = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setTitle(`${member.displayName} a quittée un salon vocal`)
			.setDescription(`Salon: ${oldChannel}\nUtilisateur : ${member}\n\n**ID :**\n\nSalon: \`\`\`${oldChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)
			.setFooter({
				text: "Gérée par l'instance de Peperehobbits01's Bot",
				iconURL: bot.user.displayAvatarURL({dynamic: true})
			})
			.setTimestamp()
			.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

		await logsChannel.send({embeds: [LeaveCall]})
	}

	if (oldChannel && newChannel) {

		if (newState.selfDeaf !== oldState.selfDeaf) {
			return;
		} else if (oldState.selfDeaf !== newState.selfDeaf) {
			return;
		}

		if (newState.selfMute !== oldState.selfMute) {
			return;
		} else if (oldState.selfMute !== newState.selfMute) {
			return;
		}

		if (newState.deaf !== oldState.deaf) {
			return;
		} else if (oldState.deaf !== newState.deaf) {
			return;
		}

		if (newState.mute !== oldState.mute) {
			return;
		} else if (oldState.mute !== newState.mute) {
			return;
		}

		if (oldChannel !== newChannel) {

			const queryMooveCall = `UPDATE voicestateupdate SET channel = '${newState.channel.id}', time = '0' WHERE user = '${member.id}'`
			await executeQuery(queryMooveCall)

			const MooveCall = new Discord.EmbedBuilder()
				.setColor(process.env.BOT_COLOR)
				.setTitle(`${member.displayName} a changée de vocal`)
				.setDescription(`**Salon**: Il était dans le salon ${oldChannel.name} et maintenant il est dans ${newChannel.name}\nAncien salon : ${oldChannel.name}\nNouveau salon : ${newChannel.name}\nUtilisateur : ${member}\n\n**ID :**\n\nAncien Salon: \`\`\`${oldChannel.id}\`\`\`\nNouveau Salon: \`\`\`${newChannel.id}\`\`\`\nUtilisateur: \`\`\`${member.id}\`\`\``)
				.setFooter({
					text: "Gérée par l'instance de Peperehobbits01's Bot",
					iconURL: bot.user.displayAvatarURL({dynamic: true})
				})
				.setTimestamp()
				.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

			await logsChannel.send({embeds: [MooveCall]})
		}
	}
};
