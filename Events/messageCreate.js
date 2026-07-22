const Discord = require("discord.js")
const {executeQuery} = require("../Fonctions/databaseConnect.js")

module.exports = async (bot, message) => {

	if (message.author.bot || message.channel.type === Discord.ChannelType.DM) return;

	const querySearch = `SELECT * FROM xp WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`
	const results = await executeQuery(querySearch)
	const xptogive = Math.floor(Math.random() * 30) + 15;

	if (results.length < 1) {

		const queryAdd = `INSERT INTO xp (guild, user, xp, level) VALUES (${message.guildId}, '${message.author.id}', '${xptogive}', '0')`
		await executeQuery(queryAdd)

	} else {

		let level = parseInt(results[0].level)
		let xp = parseInt(results[0].xp)

		if ((level + 1) * 1000 <= xp) {

			const queryXpupdate = `UPDATE xp SET xp = '${xptogive}', level = '${level + 1}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`
			await executeQuery(queryXpupdate)

			let channel = message.guild.channels.cache.get(process.env.LEVEL_PASS_CHANNEL);
			channel.send(`Tu l'as fais ${message.author}, tu arrives au niveau ${level + 1}. Bien jouée à toi!`)

		} else {

			const queryXpUpdate = `UPDATE xp SET xp = '${xp + xptogive}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`
			await executeQuery(queryXpUpdate)

		}
	}

	const channel = await bot.channels.fetch(process.env.COUNTING_CHANNEL);
	const messages = await channel.messages.fetch({limit: 2});
	const lastMessage = messages.first();
	const previousMessage = messages.last();
	const currentNumber = parseInt(lastMessage);
	const previousNumber = parseInt(previousMessage);

	if (currentNumber === previousNumber + 1) {
		return;
	} else if (isNaN(currentNumber)) {
		await lastMessage.delete();
	} else if (currentNumber !== previousNumber + 1) {
		await lastMessage.delete();
	} else if (currentNumber > 0 && !isNaN(currentNumber)) {
		await lastMessage.delete();
	}
}
