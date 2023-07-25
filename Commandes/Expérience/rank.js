const Discord = require("discord.js")
const Canvas = require("canvas")

module.exports = {

    name: "rank",
    description: "Permet de savoir le nombre d'xp d'un membre.",
    permission: "Aucune",
    dm: false,
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

    async run(bot, message, args, db) {

        let user;
        if(args.getUser("utilisateur")) {
            user = args.getUser("utilisateur")
            if(!user || !message.guild.members.cache.get(user?.id)) return message.reply("Aucun membre sélectionnée!")
        } else user = message.user;

        db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}' AND user = '${user.id}'`, async (err, req) => {

            db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}'`, async (err, all) => {

                if(req.length < 1) return message.reply("Il n'est pas renseignée dans ma liste des gens ayant de l'xp!")

                await message.deferReply()

                const calculXp = (xp, level) => {
                    let xptotal = 0;
                    for(let i = 0; i < level + 1; i++) xptotal += i * 1000
                    xptotal += xp;
                    return xptotal;
                }

                let leaderboard = await all.sort((a, b) => calculXp(parseInt(b.xp), parseInt(b.level)) - calculXp(parseInt(a.xp), parseInt(a.level)))
                let xp = parseInt(req[0].xp)
                let level = parseInt(req[0].level)
                let rank = leaderboard.findIndex(r => r.user === user.id) + 1
                let need = (level + 1) * 1000;

                const imagePath = '../../Minecraft_logo.jpg';
                const canvas = Canvas.createCanvas(700, 250)
                const context = canvas.getContext("2d")
                const background = await Canvas.loadImage(imagePath)
                context.drawImage(background, 0, 0, canvas.width, canvas.height);
                context.strokeStyle = '#08490c';
                context.strokeRect(0, 0, canvas.width, canvas.height);
                const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	            context.beginPath();
	            context.arc(125, 125, 100, 0, Math.PI * 2, true);
	            context.closePath();
	            context.clip();
                context.font = '60px sans-serif';
                context.fillStyle = '#ffffff';
                context.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);
                context.font = '28px sans-serif';
	            context.fillStyle = '#ffffff';
	            context.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);
                context.font = applyText(canvas, `${member.displayName}!`);
                context.fillStyle = '#ffffff';
                context.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'rank.png');

                //let Card = await new Canvas.rank()
                //.setBackground("https://minecraft.fr/wp-content/uploads/2021/12/iris-avec-complementary-shader.jpg")
                //.setBot(bot)
                //.setColorFont("#08490c")
                //.setRank(rank)
                //.setUser(user)
                //.setColorProgressBar("#ff0000")
                //.setGuild(message.guild)
                //.setXp(xp)
                //.setLevel(level)
                //.setXpNeed(need)
                //.toCard()

                await message.followUp({files: [new Discord.AttachmentBuilder(Canvas.toBuffer(), {name: "rank.png"})]})
            })
        })
    }
}