const Discord = require("discord.js")
const {executeQuery} = require("../Fonctions/databaseConnect.js")

module.exports = async (bot, message) => {

	if(message.author.bot || message.channel.type === Discord.ChannelType.DM) return;

	const querySearch = `SELECT * FROM xp WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`
	const results = await executeQuery(querySearch)
	let xptogive = Math.floor(Math.random() * 20) + 12;

	const member = message.guild.members.cache.get(message.author.id)

	if(member.roles.cache.has(process.env.BOOSTER_ROLE)) {
		xptogive = xptogive * 1.5
	} else if(member.roles.cache.has(process.env.MOM_ROLE) || member.roles.cache.has(process.env.EVENT_WINNER_ROLE)) {
		xptogive = xptogive * 1.25
	}

	if(results.length < 1) {

		const queryAdd = `INSERT INTO xp (guild, user, xp, level, xptotal) VALUES (${message.guildId}, '${message.author.id}', '${xptogive}', '0', '${xptogive}')`
		await executeQuery(queryAdd)

	} else {

		let level = parseInt(results[0].level)
		let xp = parseInt(results[0].xp)
		let xptotal = parseInt(results[0].xptotal)

		if(Math.round(100 * Math.pow(1.25, level)) <= xp) {

			const queryXpupdate = `UPDATE xp SET xp = '${xptogive}', level = '${level + 1}', xptotal = '${xptotal + xptogive}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`
			await executeQuery(queryXpupdate)

			let channel = message.guild.channels.cache.get(process.env.LEVEL_PASS_CHANNEL);
			channel.send(`Tu l'as fais ${message.author}, tu arrives au niveau ${level + 1}. Bien jouée à toi!`)

		} else {

			const queryXpUpdate = `UPDATE xp SET xp = '${xp + xptogive}', xptotal = '${xptotal + xptogive}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`
			await executeQuery(queryXpUpdate)

		}
	}

	const channel = await bot.channels.fetch(process.env.COUNTING_CHANNEL);

	if(message.channel.id === process.env.COUNTING_CHANNEL) {
		const messages = await channel.messages.fetch({limit: 2});
		const lastMessage = messages.first();
		const currentNumber = parseInt(lastMessage);
		const CountingEmbed = new Discord.EmbedBuilder()
			.setColor(process.env.BOT_COLOR)
			.setDescription(`${message.author} : \`${message.content}\``)

		const previousMessage = messages.last();

		if(previousMessage + 1 === currentNumber || currentNumber > 1) {
			try {
				const previousNumber = parseInt(previousMessage.embeds?.[0].description.split(":")[1].replace(/`/g, ''));

				if (currentNumber === previousNumber + 1) {
					await channel.send({embeds: [CountingEmbed]});
				}
			} catch (err) {
				const previousNumber = parseInt(previousMessage)

				if (currentNumber === previousNumber + 1) {
					await channel.send({embeds: [CountingEmbed]});
				}
			}
		} else {
			await channel.send({embeds: [CountingEmbed]});
		}
		await lastMessage.delete();
	}
}
