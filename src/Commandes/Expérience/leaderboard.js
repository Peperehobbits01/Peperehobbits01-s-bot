const Discord = require("discord.js")
const Canvas = require("canvas")
const path = require("node:path")
const {registerFont} = require("canvas")

registerFont(path.join(__dirname, "../../Assets/PermanentMarker.ttf"), {family: "Permanent Marker"})

module.exports = {

	name: "leaderboard",
	description: "Montre le classement des membres en XP sur le serveur.",
	permission: "Aucune",
	category: "📊・Système d'expérience",

	async run(bot, message) {

		await message.deferReply()

		const leaderboard = await bot.function.executeQuery([
			"SELECT * FROM xp WHERE guild = ? ORDER BY level DESC, xp DESC, user ASC LIMIT 10",
			[message.guildId],
		], bot)

		if (leaderboard.length < 1) {
			return message.editReply("Aucun utilisateur n'est enregistré sur ce serveur !")
		}

		const users = await Promise.allSettled(leaderboard.map(async entry => {
			const member = message.guild.members.cache.get(String(entry.user))
			return member?.user ?? bot.users.fetch(entry.user)
		}))
		const entries = leaderboard.map((data, index) => ({
			data,
			member: message.guild.members.cache.get(String(data.user)),
			user: users[index].status === "fulfilled" ? users[index].value : null,
		}))
		const avatars = await Promise.allSettled(entries.map(async ({member, user}) => {
			if (!user) return null
			const avatarUrl = member?.avatarURL({extension: "png"}) ?? user.displayAvatarURL({extension: "png"})
			return Canvas.loadImage(avatarUrl)
		}))
		entries.forEach((entry, index) => {
			entry.avatar = avatars[index].status === "fulfilled" ? avatars[index].value : null
		})

		const canvas = Canvas.createCanvas(1280, 700)
		const ctx = canvas.getContext("2d")

		const background = await Canvas.loadImage("./src/Assets/Niveau.jpg")
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

		const opacity = await Canvas.loadImage("./src/Assets/leaderboard_black.png")
		ctx.drawImage(opacity, 0, 0, canvas.width, canvas.height)

		entries.forEach(({avatar, data, member, user}, index) => {
			const column = Math.floor(index / 5)
			const row = index % 5
			const avatarX = column === 0 ? 104 : 744
			const textX = column === 0 ? 200 : 840
			const centerY = 74 + row * 128
			const need = Math.round(100 * Math.pow(1.25, data.level))
			const color = member?.presence?.activities?.some(activity => activity.type === Discord.ActivityType.Streaming)
				? "#593695"
				: member?.presence?.status === "online"
					? "#3ba55c"
					: member?.presence?.status === "dnd"
						? "#ed4245"
						: member?.presence?.status === "idle"
							? "#faa61a"
							: "#747f8d"

			ctx.beginPath()
			ctx.arc(avatarX, centerY, 47, 0, Math.PI * 2)
			ctx.fillStyle = color
			ctx.fill()

			ctx.save()
			ctx.beginPath()
			ctx.arc(avatarX, centerY, 42.5, 0, Math.PI * 2)
			ctx.clip()

			if (avatar) {
				ctx.drawImage(avatar, avatarX - 42.5, centerY - 42.5, 85, 85)
			} else {
				ctx.fillStyle = "#747f8d"
				ctx.fillRect(avatarX - 42.5, centerY - 42.5, 85, 85)
				ctx.fillStyle = "#ffffff"
				ctx.font = '32px "Permanent Marker"'
				ctx.textAlign = "center"
				ctx.textBaseline = "middle"
				ctx.fillText("?", avatarX, centerY)
				ctx.textAlign = "start"
				ctx.textBaseline = "alphabetic"
			}

			ctx.restore()

			ctx.fillStyle = "#fad02c"
			ctx.font = '18px "Permanent Marker"'
			const username = user ? (user.tag.length > 20 ? user.tag.slice(0, 20) : user.tag) : "Utilisateur indisponible"
			ctx.textAlign = "center"
			ctx.fillText(username, avatarX, 135 + row * 128)
			ctx.textAlign = "start"

			ctx.font = '28px "Permanent Marker"'
			ctx.fillText(`Rang : ${index + 1 === 1 ? "1er" : `${index + 1}ème`}`, textX, 60 + row * 128)
			ctx.fillText(`Niveau : ${data.level}`, textX, 90 + row * 128)
			ctx.fillText(`Expérience : ${bot.function.bigNumberFormatter(data.xp)} / ${bot.function.bigNumberFormatter(need)}`, textX, 120 + row * 128)
		})

		await message.followUp({files: [new Discord.AttachmentBuilder(canvas.toBuffer(), {name: "leaderboard.png"})]})
	}
}
