const Discord = require("discord.js")
const Canvas = require("canvas")
const { executeQuery } = require(`../../Fonctions/databaseConnect.js`);
const { calculXp } = require("../../Fonctions/calculXp.js")

module.exports = {

    name: "leaderboard",
    description: "Classement des membres en xp sur le serveur.",
    permission: "Aucune",
    dm: false,
    category: "📊・Système d'expérience",

    async run(bot, message) {

        const querySearch = `SELECT * FROM xp WHERE guild = '${message.guildId}'`
        const results = await executeQuery(querySearch)

        if (results.length < 1) return message.reply("Aucun utilisateur enregistrée sur ce serveur!")

        await message.deferReply()

        let leaderboard = results.toSorted((a, b) => calculXp(parseInt(b.xp), parseInt(b.level)) - calculXp(parseInt(a.xp), parseInt(a.level)))

        const canvas = Canvas.createCanvas(1280, 700);
        const ctx = canvas.getContext("2d");

        const background = await Canvas.loadImage(`Assets/Niveau.jpg`)
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

        const opacity = await Canvas.loadImage(`Assets/leaderboard_black.png`)
        ctx.drawImage(opacity, 0, 0, canvas.width, canvas.height)

        if (leaderboard.length <= 5) {

            for (let i = 0; i < leaderboard.length; i++) {

                const user = await bot.users.fetch(leaderboard[i].user);
                const member = message.guild.members.cache.get(leaderboard[i].user);
                const status = member?.presence?.status ?? "offline";
                const need = (parseInt(leaderboard[i].level) + 1) * 1000;

                ctx.beginPath();
                ctx.closePath();
                ctx.arc(104, (74 + ((i) * 128)), 47, 0, 2 * Math.PI, true);
                ctx.fillStyle = status === "online" ? "#3ba55c" : status === "dnd" ? "#ed4245" : status === "stream" ? "#593695" : status === "idle" ? "#faa61a" : status === "offline" ? "#747f8d" : ""
                ctx.fill();
                ctx.fillStyle = "#ffffff";
                ctx.font = '20px "Futura Book"';

                const usernameDisplay = user.username > 20 ? user.username.slice(0, 20) : user.username;
                ctx.fillText(`${usernameDisplay}`, (104 - (ctx.measureText(`${usernameDisplay}`).width / 2)), (135 + ((i) * 128)));

                ctx.fillStyle = "#ffffff";
                ctx.font = '28px "Futura Book"';
                ctx.fillText(`Rang : ${i + 1 === 1 ? "1er" : `${i + 1}ème`}`, 200, (65 + (i * 128)));
                ctx.fillText(`Niveau : ${leaderboard[i].level}`, 200, (95 + (i * 128)));
                ctx.fillText(`Expérience : ${leaderboard[i].xp} / ${need}`, 200, (125 + (i * 128)));
            }

            ctx.beginPath();

            for (let i = 0; i < leaderboard.length; i++) {
                ctx.arc(104, (74 + ((i) * 128)), 42.5, 0, Math.PI * 2, true);
            }
            ctx.closePath();
            ctx.clip();

            for (let i = 0; i < leaderboard.length; i++) {

                const user = await bot.users.fetch(leaderboard[i].user);
                const member = message.guild.members.cache.get(leaderboard[i].user)

                if (user) {
                    const avatar = await Canvas.loadImage(member ? member.avatar ? member.avatarURL({extension: "jpg"}) : user.displayAvatarURL({extension: "jpg"}) : user.displayAvatarURL({extension: "jpg"}))
                    ctx.drawImage(avatar, 62, (32 + (i * 128)), 85, 85);
                }
            }

        } else {

            for (let i = 0; i < leaderboard[i]; i++) {
                if (i < 5) {

                    const member = message.guild.members.cache.get(leaderboard[i].user);
                    const status = member?.presence?.status ?? "offline";
                    const need = (parseInt(leaderboard[i].level) + 1) * 1000;

                    ctx.beginPath();

                    ctx.arc(104, (84 + ((i) * 128)), 47, 0, 2 * Math.PI, true);
                    ctx.closePath();
                    ctx.fillStyle = status === "online" ? "#3ba55c" : status === "dnd" ? "#ed4245" : status === "stream" ? "#593695" : status === "idle" ? "#faa61a" : status === "offline" ? "#747f8d" : ""
                    ctx.fill();

                    ctx.font = '12px "Futura Book"';
                    ctx.fillStyle = "#ffffff";
                    ctx.fillText(`${leaderboard[i].user.tag.length > 20 ? leaderboard[i].user.tag.slice(0, 20) : leaderboard[i].user.tag}`, (104 - (ctx.measureText(`${leaderboard[i].user.tag.length > 20 ? leaderboard[i].user.tag.slice(0, 20) : leaderboard[i].user.tag}`).width / 2)), (145 + (i * 128)));

                    ctx.font = '20px "Futura Book"';
                    ctx.fillStyle = "#ffffff";
                    ctx.fillText(`${leaderboard[i].user.tag.length > 20 ? leaderboard[i].user.tag.slice(0, 20) : leaderboard[i].user.tag}`, (104 - (ctx.measureText(`${leaderboard[i].user.tag.length > 20 ? leaderboard[i].user.tag.slice(0, 20) : leaderboard[i].user.tag}`).width / 2)), (145 + (i * 128)));

                    ctx.font = '28px "Futura Book"';
                    ctx.fillStyle = "#ffffff";
                    ctx.fillText(`Rang : ${i + 1 === 1 ? "1er" : `${i + 1}ème`}`, 200, (65 + (i * 128)));
                    ctx.fillText(`Niveau : ${leaderboard[i].level}`, 200, (95 + (i * 128)));
                    ctx.fillText(`Expérience : ${leaderboard[i].xp} / ${need}`, 200, (125 + (i * 128)));

                } else {

                    const member = message.guild.members.cache.get(leaderboard[i].user)
                    const status = member ? member.presence ? member.presence.status : "offline" : "offline";
                    const need = (leaderboard[i].level + 1) * 1000;

                    ctx.beginPath();
                    ctx.arc(744, ((84 + ((i - 5) * 128))), 47, 0, 2 * Math.PI, true);
                    ctx.closePath();
                    ctx.fillStyle = status === "online" ? "#3ba55c" : status === "dnd" ? "#ed4245" : status === "stream" ? "#593695" : status === "idle" ? "#faa61a" : status === "offline" ? "#747f8d" : ""
                    ctx.fill();

                    ctx.font = '12px "Futura Book"';
                    ctx.fillStyle = "#ffffff";
                    ctx.fillText(`${leaderboard[i].user.tag.length > 20 ? leaderboard[i].user.tag.slice(0, 20) : leaderboard[i].user.tag}`, (744 - (ctx.measureText(`${leaderboard[i].user.tag.length > 20 ? leaderboard[i].user.tag.slice(0, 20) : leaderboard[i].user.tag}`).width / 2)), (145 + ((i - 5) * 128)));

                    ctx.font = '20px "Futura Book"';
                    ctx.fillStyle = "#ffffff";
                    ctx.fillText(`${leaderboard[i].user.tag.length > 20 ? leaderboard[i].user.tag.slice(0, 20) : leaderboard[i].user.tag}`, (744 - (ctx.measureText(`${leaderboard[i].user.tag.length > 20 ? leaderboard[i].user.tag.slice(0, 20) : leaderboard[i].user.tag}`).width / 2)), (145 + ((i - 5) * 128)));

                    ctx.font = '28px "Futura Book"';
                    ctx.fillStyle = "#ffffff";
                    ctx.fillText(`Rang : ${i + 1 === 1 ? "1er" : `${i + 1}ème`}`, 840, (65 + ((i - 5) * 128)));
                    ctx.fillText(`Niveau : ${leaderboard[i].level}`, 840, (95 + ((i - 5) * 128)));
                    ctx.fillText(`Expérience : ${leaderboard[i].xp} / ${need}`, 840, (125 + ((i - 5) * 128)));
                }
            }

            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const user = await bot.users.fetch(leaderboard[i].user);
                const member = message.guild.members.cache.get(user.id)

                if (user) {
                    const avatar = await Canvas.loadImage(member ? member.avatar ? member.avatarURL({extension: "jpg"}) : user.displayAvatarURL({extension: "jpg"}) : user.displayAvatarURL({extension: "jpg"}))
                    ctx.drawImage(avatar, 62, (42 + (i * 128)), 85, 85);
                }
            }

            for (let i = 5; i < leaderboard.length; i++) {

                const user = await bot.users.fetch(leaderboard[i].user);
                const member = message.guild.members.cache.get(user.id)

                if (user) {
                    const avatar = await Canvas.loadImage(member ? member.avatar ? member.avatarURL({extension: "jpg"}) : user.displayAvatarURL({extension: "jpg"}) : user.displayAvatarURL({extension: "jpg"}))
                    ctx.drawImage(avatar, 702, (42 + ((i - 5) * 128)), 85, 85);
                }
            }
        }

        await message.followUp({files: [new Discord.AttachmentBuilder(canvas.toBuffer(), {name: "leaderboard.png"})]})
    }
}