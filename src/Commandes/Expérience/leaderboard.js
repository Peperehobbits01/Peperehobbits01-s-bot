const Discord = require("discord.js")
const Canvas = require("canvas")
const {executeQuery} = require(`../../Fonctions/databaseConnect.js`);
const {registerFont} = require("canvas")

module.exports = {

	name: "leaderboard",
	description: "Classement des membres en xp sur le serveur.",
	permission: "Aucune",
	category: "📊・Système d'expérience",

	async run(bot, message) {

		const querySearch = `SELECT * FROM xp WHERE guild = '${message.guildId}' ORDER BY level DESC, xp DESC LIMIT 10`
		const leaderboard = await executeQuery(querySearch)

		if(leaderboard.length < 1) return message.reply("Aucun utilisateur n'est enregistré sur ce serveur !")

		await message.deferReply()

		const canvas = Canvas.createCanvas(1280, 700);
		const ctx = canvas.getContext("2d");

		const background = await Canvas.loadImage(`./src/Assets/Niveau.jpg`)
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

		const opacity = await Canvas.loadImage(`./src/Assets/leaderboard_black.png`)
		ctx.drawImage(opacity, 0, 0, canvas.width, canvas.height)

		registerFont('./src/Assets/PermanentMarker.ttf', {family: 'Permanent Marker'})

		for (let i = 0; i < leaderboard.length && i < 5; i++) {

			const user = await bot.users.fetch(leaderboard[i].user);
			const member = message.guild.members.cache.get(user.id);
			const status = member?.presence?.status ?? "offline";
			const need = Math.round(100 * Math.pow(1.25, leaderboard[i].level));

			ctx.beginPath();
			ctx.arc(104, (74 + ((i) * 128)), 47, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fillStyle = status === "online" ? "#3ba55c" : status === "dnd" ? "#ed4245" : status === "stream" ? "#593695" : status === "idle" ? "#faa61a" : status === "offline" ? "#747f8d" : "";
			ctx.fill();

			ctx.save();
			ctx.beginPath();
			ctx.arc(104, (74 + ((i) * 128)), 42.5, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.clip();

			const avatar = await Canvas.loadImage(member ? member.avatar ? member.avatarURL({extension: "png"}) : user.displayAvatarURL({extension: "png"}) : user.displayAvatarURL({extension: "png"}));
			ctx.drawImage(avatar, 104 - 85 / 2, 74 + ((i) * 128) - 85 / 2, 85, 85);

			ctx.restore();

			ctx.fillStyle = "#ffffff";
			ctx.font = '18px "Permanent Marker"';
			const username = user.tag.length > 20 ? user.tag.slice(0, 20) : user.tag;
			ctx.fillText(`${username}`, (104 - (ctx.measureText(`${username}`).width / 2)), (135 + (i * 128)));

			ctx.fillStyle = "#ffffff";
			ctx.font = '28px "Permanent Marker"';
			ctx.fillText(`Rang : ${i + 1 === 1 ? "1er" : `${i + 1}ème`}`, 200, (60 + (i * 128)));
			ctx.fillText(`Niveau : ${leaderboard[i].level}`, 200, (90 + (i * 128)));
			ctx.fillText(`Expérience : ${leaderboard[i].xp} / ${need}`, 200, (120 + (i * 128)));
		}

		if (leaderboard.length > 5) {

		const column2Count = Math.min(leaderboard.length - 5, 5);
		const column2X = 744;

			for (let i = 0; i < column2Count; i++) {

				const leaderboardIndex = 5 + i;
				const user = await bot.users.fetch(leaderboard[leaderboardIndex].user);
				const member = message.guild.members.cache.get(user.id);
				const status = member?.presence?.status ?? "offline";
				const need = Math.round(100 * Math.pow(1.25, leaderboard[leaderboardIndex].level));

				ctx.beginPath();
				ctx.arc(column2X, (74 + ((i) * 128)), 47, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fillStyle = status === "online" ? "#3ba55c" : status === "dnd" ? "#ed4245" : status === "stream" ? "#593695" : status === "idle" ? "#faa61a" : status === "offline" ? "#747f8d" : "";
				ctx.fill();

				ctx.save();
				ctx.beginPath();
				ctx.arc(column2X, (74 + ((i) * 128)), 42.5, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.clip();

				const avatar = await Canvas.loadImage(member ? member.avatar ? member.avatarURL({extension: "png"}) : user.displayAvatarURL({extension: "png"}) : user.displayAvatarURL({extension: "png"}));
				ctx.drawImage(avatar, column2X - 85 / 2, 74 + ((i) * 128) - 85 / 2, 85, 85);

				ctx.restore();

				ctx.fillStyle = "#ffffff";
				ctx.font = '18px "Permanent Marker"';
				const username = user.tag.length > 20 ? user.tag.slice(0, 20) : user.tag;
				ctx.fillText(`${username}`, (column2X - (ctx.measureText(`${username}`).width / 2)), (135 + (i * 128)));

				ctx.fillStyle = "#ffffff";
				ctx.font = '28px "Permanent Marker"';
				ctx.fillText(`Rang : ${i + 6 === 1 ? "1er" : `${i + 6}ème`}`, 840, (60 + (i * 128)));
				ctx.fillText(`Niveau : ${leaderboard[leaderboardIndex].level}`, 840, (90 + (i * 128)));
				ctx.fillText(`Expérience : ${leaderboard[leaderboardIndex].xp} / ${need}`, 840, (120 + (i * 128)));
			}
		}

		await message.followUp({files: [new Discord.AttachmentBuilder(canvas.toBuffer(), {name: "leaderboard.png"})]})
	}
}
