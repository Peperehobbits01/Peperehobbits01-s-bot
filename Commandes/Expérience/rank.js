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

		let leaderboard = resultsLeaderBoard.toSorted((a, b) => calculXp(parseInt(b.xp), parseInt(b.level)) - calculXp(parseInt(a.xp), parseInt(a.level)))
		let userInLeaderboard = results.find(u => u.user === user.id)
		let xp = parseInt(userInLeaderboard.xp)
		let level = parseInt(userInLeaderboard.level)
		let rank = leaderboard.findIndex(r => r.user === user.id) + 1
		let need = (level + 1) * 1000;
		let guild = message.guild

		const canvas = Canvas.createCanvas(800, 300)
		const ctx = canvas.getContext("2d")

		const background = await Canvas.loadImage('Assets/Niveau.jpg')
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

		const opacity = await Canvas.loadImage(`Assets/leaderboard_black.png`)
		ctx.drawImage(opacity, 0, 0, canvas.width, canvas.height)

		registerFont('./Assets/PermanentMarker.ttf', {family: 'Permanent Marker'})

		const member = message.guild.members.cache.get(user.id);
		const status = member?.presence?.status ?? "offline";
		const fetchedUser = await bot.users.fetch(user.id);
		const badge = fetchedUser.flags.toArray()
			.filter(b => b !== "BotHTTPInteractions"
				&& b !== "Quarantined"
				&& b !== "Spammer"
				&& b !== "TeamPseudoUser"
				&& b !== "VerifiedBot"
			);

		//const hasNitro = member && member.premiumType && member.premiumType > 0;

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

		//Badge de l'utilisateur
		if (fetchedUser.flags.bitfield !== 0) {

			for (let i = 0; i < badge.length; i++) {
				let b;
				switch (badge[i]) {
					case "HypeSquadOnlineHouse1":
						b = await Canvas.loadImage(`Assets/Hypesquad1.png`);
						break;
					case "HypeSquadOnlineHouse2":
						b = await Canvas.loadImage(`Assets/Hypesquad2.png`);
						break;
					case "HypeSquadOnlineHouse3":
						b = await Canvas.loadImage(`Assets/Hypesquad3.png`);
						break;
					case "Staff":
						b = await Canvas.loadImage(`Assets/Staff.png`);
						break;
					case "Partner":
						b = await Canvas.loadImage(`Assets/Partner.png`);
						break;
					case "Hypesquad":
						b = await Canvas.loadImage(`Assets/Hypesquad4.png`);
						break;
					case "BugHunterLevel1":
						b = await Canvas.loadImage(`Assets/BugHunter1.png`);
						break;
					case "BugHunterLevel2":
						b = await Canvas.loadImage(`Assets/BugHunter2.png`);
						break;
					case "PremiumEarlySupporter":
						b = await Canvas.loadImage(`Assets/PremiumEarlySupport.png`);
						break;
					case "VerifiedDeveloper":
						b = await Canvas.loadImage(`Assets/VerifiedDeveloper.png`);
						break;
					case "CertifiedModerator":
						b = await Canvas.loadImage(`Assets/CertifiedModerator.png`);
						break;
					case "ActiveDeveloper":
						b = await Canvas.loadImage(`Assets/ActiveDeveloper.png`);
						break;
					case "OldUserName":
						b = await Canvas.loadImage(`Assets/OldUserNameBadge.png`);
						break;
					default:
						break;
				}
				ctx.drawImage(b, 275 + i * 50, 215, 50, 50)

				if (i === (badge.length - 1)) {
					if ((await guild.fetchOwner()).id === user.id) {
						const b = await Canvas.loadImage(`Assets/OwnerServer.png`)
						ctx.drawImage(b, 275 + (i + 1) * 50, 215, 50, 50)
					}
					if (member && member.premiumSinceTimestamp !== null) {
						const b = await Canvas.loadImage(Date.now() - member.premiumSinceTimestamp >= 63115200000 ? `Assets/NitroBoost1.png` : Date.now() - member.premiumSinceTimestamp >= 47336400000 ? `Assets/NitroBoost2.png` : Date.now() - member.premiumSinceTimestamp >= 39447000000 ? `Assets/NitroBoost3.png` : Date.now() - member.premiumSinceTimestamp >= 31557600000 ? `Assets/NitroBoost4.png` : Date.now() - member.premiumSinceTimestamp >= 23668200000 ? `Assets/NitroBoost5.png` : Date.now() - member.premiumSinceTimestamp >= 15778800000 ? `Assets/NitroBoost6.png` : Date.now() - member.premiumSinceTimestamp >= 7889400000 ? `Assets/NitroBoost7.png` : Date.now() - member.premiumSinceTimestamp >= 5259600000 ? `Assets/NitroBoost8.png` : Date.now() - member.premiumSinceTimestamp >= 2629800000`Assets/NitroBoost9.png`)
						ctx.drawImage(b, 275 + (i + 1) * 50, 215, 50, 50)
					}

					/*if(hasNitro) {
						const b = await Canvas.loadImage(`Assets/NitroBadge.png`)
						ctx.drawImage(b, 275 + (i+1) * 50, 220, 72, 50)
					}*/
				}
			}

		} else {

			if ((await guild.fetchOwner()).id === user.id) {
				const b = await Canvas.loadImage(`Assets/OwnerServer.png`)
				ctx.drawImage(b, 275, 215, 50, 50)
			}

			if (member && member.premiumSinceTimestamp !== null) {
				const b = await Canvas.loadImage(Date.now() - member.premiumSinceTimestamp >= 63115200000 ? `Assets/NitroBoost1.png` : Date.now() - member.premiumSinceTimestamp >= 47336400000 ? `Assets/NitroBoost2.png` : Date.now() - member.premiumSinceTimestamp >= 39447000000 ? `Assets/NitroBoost3.png` : Date.now() - member.premiumSinceTimestamp >= 31557600000 ? `Assets/NitroBoost4.png` : Date.now() - member.premiumSinceTimestamp >= 23668200000 ? `Assets/NitroBoost5.png` : Date.now() - member.premiumSinceTimestamp >= 15778800000 ? `Assets/NitroBoost6.png` : Date.now() - member.premiumSinceTimestamp >= 7889400000 ? `Assets/NitroBoost7.png` : Date.now() - member.premiumSinceTimestamp >= 5259600000 ? `Assets/NitroBoost8.png` : Date.now() - member.premiumSinceTimestamp >= 2629800000`Assets/NitroBoost9.png`)
				ctx.drawImage(b, 275, 215, 50, 50)
			}

			/*if(hasNitro) {
				const b = await Canvas.loadImage(`Assets/NitroBadge.png`)
				ctx.drawImage(b, 325, 220, 72, 50)
			}*/
		}

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
