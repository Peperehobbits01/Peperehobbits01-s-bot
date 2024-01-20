const Discord = require("discord.js")
const Canvas = require("canvas")

module.exports = {

    name: "leaderboard",
    description: "Classement des membres en xp sur le serveur.",
    permission: "Aucune",
    dm: false,
    category: "📊・Système d'expérience",

    async run(bot, message, args, db) {

        db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}'`, async (err, req) => {

            if(req.length < 1) return message.reply("Cet utilisateur n'a parlée sur se serveur!")

            await message.deferReply()

            const calculXp = (xp, level) => {
                let xptotal = 0;
                for(let i = 0; i < level + 1; i++) xptotal += i * 1000
                xptotal += xp;
                return xptotal;
            }

            let leaderboard = await req.sort((a, b) => calculXp(parseInt(b.xp), parseInt(b.level)) - calculXp(parseInt(a.xp), parseInt(a.level)))
    
            const canvas = Canvas.createCanvas(1280, 700);
            const ctx = canvas.getContext("2d");
    
            const background = await Canvas.loadImage(`Assets/Niveau.jpg`)
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
    
            const opacity = await Canvas.loadImage(`Assets/leaderboard_black.png`)
            ctx.drawImage(opacity, 0, 0, canvas.width, canvas.height)
    
            if(leaderboard <= 5) {
            
                for(let i = 0; i < leaderboard; i++) {
    
                    const member = guild.members.cache.get(leaderboard[i].user.id)
                    const status = member ? member.presence.status : "offline";
    
                    ctx.beginPath();
                    ctx.arc(104, (74 + (i * 128)), 47, 0, 2 * Math.PI, true);
                    ctx.closePath();
                    ctx.fillStyle = status === "online" ? "#3ba55c" : status === "dnd" ? "#ed4245" : status === "stream" ? "#593695" : status === "idle" ? "#faa61a" : status === "offline" ? "#747f8d" : ""
                    ctx.fill();
    
                    ctx.font = '12px "Futura Book"';
                    ctx.fillStyle = "#08490c";
                    ctx.fillText(`${leaderboard[i].user.tag.length > 20 ? leaderboard[i].user.tag.slice(0, 20) : leaderboard[i].user.tag}`, (104 - (ctx.measureText(`${leaderboard[i].user.tag.length > 20 ? leaderboard[i].user.tag.slice(0, 20) : leaderboard[i].user.tag}`).width / 2)), (135 + (i * 128)));
    
                    ctx.font = '28px "Futura Book"';
                    ctx.fillStyle = "#08490c";
                    ctx.fillText(`Rang : ${i + 1 === 1 ? "1er" : `${i + 1}ème`}`, 200, (65 + ((i <= 4 ? i : i - 5) * 128)));
                    ctx.fillText(`Level : ${leaderboard[i].level}`, 200, (95 + ((i <= 4 ? i : i - 5) * 128)));
                    ctx.fillText(`Expérience : ${leaderboard[i].xp} / ${leaderboard[i].need}`, 200, (125 + ((i <= 4 ? i : i - 5) * 128)));
                }
    
                ctx.beginPath();
                for(let i = 0; i < leaderboard; i++) {
                    ctx.arc(104, (74 + ((i) * 128)), 42.5, 0, Math.PI * 2, true);
                }
                ctx.closePath();
                ctx.clip();
    
                for(let i = 0; i < leaderboard; i++) {
    
                    const user = await bot.users.fetch(leaderboard[i].user.id);
                    const member = guild.members.cache.get(leaderboard[i].user.id)
                    
                    if(user) {
                        const avatar = await Canvas.loadImage(member ? member.avatar ? member.avatarURL({extension: "jpg"}) : user.displayAvatarURL({ extension: "jpg" }) : user.displayAvatarURL({ extension: "jpg" }))
                        ctx.drawImage(avatar, 62, (32 + (i * 128)), 85, 85);
                    }
                }
    
            } else {
    
                for(let i = 0; i < leaderboard; i++) {
    
                    if(i <= 4) {
    
                        const member = guild.members.cache.get(leaderboard[i].user.id)
                        const status = member ? member.presence.status : "offline";
    
                        ctx.beginPath();
                        ctx.arc(104, (84 + (i <= 4 ? i : i - 5) * 128), 47, 0, 2 * Math.PI, true);
                        ctx.closePath();
                        ctx.fillStyle = status === "online" ? "#3ba55c" : status === "dnd" ? "#ed4245" : status === "stream" ? "#593695" : status === "idle" ? "#faa61a" : status === "offline" ? "#747f8d" : ""
                        ctx.fill();
    
                        ctx.font = '12px "Futura Book"';
                        ctx.fillStyle = "#08490c";
                        ctx.fillText(`${leaderboard[i].user.tag.length > 20 ? leaderboard[i].user.tag.slice(0, 20) : leaderboard[i].user.tag}`, (104 - (ctx.measureText(`${leaderboard[i].user.tag.length > 20 ? leaderboard[i].user.tag.slice(0, 20) : leaderboard[i].user.tag}`).width / 2)), (145 + ((i <= 4 ? i : i - 5) * 128)));
    
                        ctx.font = '28px "Futura Book"';
                        ctx.fillStyle = "#08490c";
                        ctx.fillText(`Rang : ${i + 1 === 1 ? "1er" : `${i + 1}ème`}`, 200, (65 + ((i <= 4 ? i : i - 5) * 128)));
                        ctx.fillText(`Level : ${leaderboard[i].level}`, 200, (95 + ((i <= 4 ? i : i - 5) * 128)));
                        ctx.fillText(`Expérience : ${leaderboard[i].xp} / ${leaderboard[i].need}`, 200, (125 + ((i <= 4 ? i : i - 5) * 128)));
                    
                    } else {
    
                        const member = guild.members.cache.get(leaderboard[i].user.id)
                        const status = member ? member.presence ? member.presence.status : "offline" : "offline";
    
                        ctx.beginPath();
                        ctx.arc(744, ((84 + (i <= 4 ? i : i - 5) * 128)), 47, 0, 2 * Math.PI, true);
                        ctx.closePath();
                        ctx.fillStyle = status === "online" ? "#3ba55c" : status === "dnd" ? "#ed4245" : status === "stream" ? "#593695" : status === "idle" ? "#faa61a" : status === "offline" ? "#747f8d" : ""
                        ctx.fill();
    
                        ctx.font = '12px "Futura Book"';
                        ctx.fillStyle = "#08490c";
                        ctx.fillText(`${leaderboard[i].user.tag.length > 20 ? leaderboard[i].user.tag.slice(0, 20) : leaderboard[i].user.tag}`, (744 - (ctx.measureText(`${leaderboard[i].user.tag.length > 20 ? leaderboard[i].user.tag.slice(0, 20) : leaderboard[i].user.tag}`).width / 2)), (145 + ((i <= 4 ? i : i - 5) * 128)));
    
                        ctx.font = '28px "Futura Book"';
                        ctx.fillStyle = "#08490c";
                        ctx.fillText(`Rang : ${i + 1 === 1 ? "1er" : `${i + 1}ème`}`, 840, (65 + ((i <= 4 ? i : i - 5) * 128)));
                        ctx.fillText(`Level : ${leaderboard[i].level}`, 840, (95 + ((i <= 4 ? i : i - 5) * 128)));
                        ctx.fillText(`Expérience : ${leaderboard[i].xp} / ${leaderboard[i].need}`, 840, (125 + ((i <= 4 ? i : i - 5) * 128)));
                    }
                }
    
                ctx.beginPath();
                ctx.arc(104, (84 + (0 * 128)), 42.5, 0, Math.PI * 2);
                ctx.arc(744, (84 + (0 * 128)), 42.5, Math.PI * 1, Math.PI * 3);
                ctx.arc(104, (84 + (1 * 128)), 42.5, 0, Math.PI * 2);
                ctx.arc(744, (84 + (1 * 128)), 42.5, Math.PI * 1, Math.PI * 3);
                ctx.arc(104, (84 + (2 * 128)), 42.5, 0, Math.PI * 2);
                ctx.arc(744, (84 + (2 * 128)), 42.5, Math.PI * 1, Math.PI * 3);
                ctx.arc(104, (84 + (3 * 128)), 42.5, 0, Math.PI * 2);
                ctx.arc(744, (84 + (3 * 128)), 42.5, Math.PI * 1, Math.PI * 3);
                ctx.arc(104, (84 + (4 * 128)), 42.5, 0, Math.PI * 2);
                ctx.arc(744, (84 + (4 * 128)), 42.5, Math.PI * 1, Math.PI * 3);
                ctx.closePath();
                ctx.clip();
    
                for(let i = 0; i < 5; i++) {
    
                    const user = await bot.users.fetch(leaderboard[i].user.id);
                    const member = await guild.members.cache.get(user.id)
    
                    if(user) {
                        const avatar = await Canvas.loadImage(member ? member.avatar ? member.avatarURL({extension: "jpg"}) : user.displayAvatarURL({ extension: "jpg" }) : user.displayAvatarURL({ extension: "jpg" }))
                        ctx.drawImage(avatar, 62, (42 + (i * 128)), 85, 85);
                    }
                }
    
                for(let i = 5; i < leaderboard; i++) {
    
                    const user = await bot.users.fetch(leaderboard[i].user.id);
                    const member = await guild.members.cache.get(user.id)
    
                    if(user) {
                        const avatar = await Canvas.loadImage(member ? member.avatar ? member.avatarURL({extension: "jpg"}) : user.displayAvatarURL({ extension: "jpg" }) : user.displayAvatarURL({ extension: "jpg" }))
                        ctx.drawImage(avatar, 702, (42 + ((i - 5) * 128)), 85, 85);
                    }
                }
            }    

            await message.followUp({files: [new Discord.AttachmentBuilder(canvas.toBuffer(), {name: "leaderboard.png"})]})
        })
    }
}