const Discord = require("discord.js")
const Canvas = require("canvas")
const {executeQuery} = require(`../../Fonctions/databaseConnect.js`);
const {calculXp} = require("../../Fonctions/calculXp.js")
const {registerFont} = require("canvas");

module.exports = {

	name: "rank",
	description: "Permet de savoir le nombre d'xp d'un membre.",
	permission: "Aucune",
	category: "📊・Système d'expérience",
	options: [
		{
			type: "user",
			name: "utilisateur",
			description: "L'utilisateur dont ont veux savoir l'xp",
			required: false,
			autocomplete: false
		}
	],

	async run(bot, message, args) {

		let user = args.getUser("utilisateur")
		if (!user) user = message.user

		const querySearch = `SELECT * FROM xp WHERE guild = '${message.guildId}' AND user = '${user.id}'`
		const results = await executeQuery(querySearch);

		if (results.length < 1) return message.reply("Il n'est pas renseignée dans ma liste des gens possèdent de l'expérience!")

		await message.deferReply()

		const querySearchLeaderBoard = `SELECT * FROM xp WHERE guild = '${message.guildId}'`
		const resultsLeaderBoard = await executeQuery(querySearchLeaderBoard);

		for(let i = 0; i < resultsLeaderBoard.length; i++) {
			const user = await bot.users.fetch(resultsLeaderBoard[i].user);

			if(user.username.startsWith("deleted")) {
				const xpSystemRemove = `DELETE FROM xp WHERE user = ${user.id}`
				await executeQuery(xpSystemRemove)
			}
		}

		let leaderboard = resultsLeaderBoard.toSorted((a, b) => calculXp(parseInt(b.xp), parseInt(b.level)) - calculXp(parseInt(a.xp), parseInt(a.level)))
		let userInLeaderboard = results.find(u => u.user === user.id)
		let xp = parseInt(userInLeaderboard.xp)
		let level = parseInt(userInLeaderboard.level)
		let rank = leaderboard.findIndex(r => r.user === user.id) + 1
		let need = Math.round(100 * Math.pow(1.25, level));

		const canvas = Canvas.createCanvas(800, 300)
		const ctx = canvas.getContext("2d")

		const background = await Canvas.loadImage('./src/Assets/Niveau.jpg')
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

		const opacity = await Canvas.loadImage(`./src/Assets/rank_black.png`)
		ctx.drawImage(opacity, 0, 0, canvas.width, canvas.height)

		registerFont('./src/Assets/PermanentMarker.ttf', {family: 'Permanent Marker'})

		const member = message.guild.members.cache.get(user.id);
		const status = member?.presence?.status ?? "offline";

		if (xp > need) xp = need
		if (xp < 0) xp = 0

		const barre = Math.floor(xp / need * 490)

		//Barre d'xp qui ne se remplie pas
		ctx.beginPath()
		ctx.globalAlpha = 1;
		ctx.lineWidth = 2;
		ctx.fillStyle = "#ffffff"
		ctx.moveTo(220, 92.5)
		ctx.quadraticCurveTo(220, 75, 240, 75)
		ctx.lineTo(710, 75)
		ctx.quadraticCurveTo(730, 75, 730, 92.5)
		ctx.quadraticCurveTo(730, 110, 710, 110)
		ctx.lineTo(240, 110)
		ctx.quadraticCurveTo(220, 110, 220, 92.5)
		ctx.fill()
		ctx.closePath()

		//Barre d'xp qui se remplie
		ctx.beginPath()
		ctx.globalAlpha = 1;
		ctx.lineWidth = 2;
		ctx.fillStyle = "#fad02c"
		ctx.moveTo(220, 92.5)
		ctx.quadraticCurveTo(220, 75, 240, 75)
		ctx.lineTo(240 + barre - 20, 75)
		ctx.quadraticCurveTo(240 + barre, 75, 240 + barre, 92.5)
		ctx.quadraticCurveTo(240 + barre, 110, 240 + barre - 20, 110)
		ctx.lineTo(240, 110)
		ctx.quadraticCurveTo(220, 110, 220, 92.5)
		ctx.fill()
		ctx.closePath()

		//Pourcentage + Xp
		ctx.font = '24px "Permanent Marker"'
		ctx.fillStyle = "#2C55FA"
		ctx.fillText(`${Math.floor(xp * 100 / need)}%`, 665, 100)
		ctx.fillText(`${xp} / ${need} xp`, 275, 100)

		//Level + Rang
		ctx.font = '36px "Permanent Marker"'
		ctx.fillStyle = "#ffffff"
		ctx.fillText(`Niveau : ${level}`, 275, 150)
		rank === 1 ? ctx.fillText(`Rang : ${rank}er`, 520, 150) : ctx.fillText(`Rang : ${rank}ème`, 475, 150)

		//Tag de l'utilisateur
		ctx.font = '36px "Permanent Marker"'
		ctx.fillStyle = "#ffffff"
		ctx.fillText(`${user.tag.length > 15 ? user.tag.slice(0, 15) + "..." : user.tag}`, 275, 200)

		//Status
		ctx.beginPath()
		ctx.arc(160, 150, 108, 0, 2 * Math.PI, true)
		ctx.closePath()
		ctx.fillStyle = status === "online" ? "#3ba55c" : status === "dnd" ? "#ed4245" : status === "stream" ? "#593695" : status === "idle" ? "#faa61a" : status === "offline" ? "#747f8d" : ""
		ctx.fill()

		//Avatar
		ctx.beginPath()
		ctx.arc(160, 150, 100, 0, 2 * Math.PI, true)
		ctx.closePath()
		ctx.clip()

		const avatar = await Canvas.loadImage(member ? member.avatar ? member.avatarURL({extension: 'png'}) : user.displayAvatarURL({extension: 'png'}) : user.displayAvatarURL({extension: 'png'}))
		ctx.drawImage(avatar, 60, 50, 200, 200)

		await message.followUp({files: [new Discord.AttachmentBuilder(canvas.toBuffer(), {name: "rank.png"})]})
	}
}
