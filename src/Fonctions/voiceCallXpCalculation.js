const {executeQuery} = require('./databaseConnect')

const activeTimers = new Map()

const voiceCallXpCalculation = async (oldChannel, newChannel, newState, oldState, member) => {
	if (!newChannel) return

	const existingTimer = activeTimers.get(member.id)
	if (existingTimer) {
		clearInterval(existingTimer)
		activeTimers.delete(member.id)
	}

	const xpGiver = setInterval(async () => {
		const lookupUser = `SELECT * FROM xp WHERE guild = '${oldState.guild.id}' AND user = ${member.id}`
		const lookUpUserResults = await executeQuery(lookupUser)

		let xptogive = Math.floor(Math.random() * 30) + 15
		const user = oldState.guild.members.cache.get(member.id)

		if (user?.roles?.cache.has(process.env.BOOSTER_ROLE)) {
			xptogive = Math.floor(xptogive * 1.5)
		} else if (user?.roles?.cache.has(process.env.MOM_ROLE) || user?.roles?.cache.has(process.env.EVENT_WINNER_ROLE)) {
			xptogive = Math.floor(xptogive * 1.25)
		}

		if (lookUpUserResults.length < 1) {
			const queryAdd = `INSERT INTO xp (guild, user, xp, level, xptotal) VALUES ('${oldState.guild.id}', '${member.id}', '${xptogive}', 0, '${xptogive}')`
			await executeQuery(queryAdd)

		} else {
			let level = parseInt(lookUpUserResults[0].level)
			let xp = parseInt(lookUpUserResults[0].xp)
			let xptotal = parseInt(lookUpUserResults[0].xptotal)

			if(Math.round(100 * Math.pow(1.25, level)) <= xp + xptogive) {
				const xpneeded = Math.round(100 * Math.pow(1.25, level))

				const queryXpupdate = `UPDATE xp SET xp = '${xp + xptogive - xpneeded}', level = '${level + 1}', xptotal = '${xptotal + xptogive}' WHERE guild = '${oldState.guild.id}' AND user = '${member.id}'`
				await executeQuery(queryXpupdate)

				let levelChannel = oldState.guild.channels.cache.get(process.env.LEVEL_PASS_CHANNEL);
				levelChannel.send(`Tu l'as fais ${user}, tu arrives au niveau ${level + 1}. Bien jouée à toi!`)

			} else {

				const queryXpUpdate = `UPDATE xp SET xp = '${xp + xptogive}', xptotal = '${xptotal + xptogive}' WHERE guild = '${oldState.guild.id}' AND user = '${member.id}'`
				await executeQuery(queryXpUpdate)

			}
		}
	}, 60000)

	activeTimers.set(member.id, xpGiver)
}

module.exports = {voiceCallXpCalculation, activeTimers}
