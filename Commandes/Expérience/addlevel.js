const Discord = require("discord.js")

module.exports = {

    name: "addlevel",
    description: "Donne des levels à un membre",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "📊・Système d'expérience",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à qui donner des levels.",
            required: true,
            autocomplete: false
        }, {
            type: "number",
            name: "level",
            description: "Le montant des levels à donner.",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {

        let member = args.getMember("membre")
        if(!member) return message.reply({embeds: [

            new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setDescription("Indiquer un membre !")
            .setFooter({text: `Gérée par l'instance de Peperehobbits01's bot`, iconURL: (bot.user.displayAvatarURL({dynamic: true}))})
            .setTimestamp()
            .setTitle("Erreur d'ajout de niveaux")
        ]})
        let level = args.getNumber("level")
        if(!level) return message.reply({embeds: [

            new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setDescription("Indiquer combien de nievaux à ajouter !")
            .setFooter({text: `Gérée par l'instance de Peperehobbits01's bot`, iconURL: (bot.user.displayAvatarURL({dynamic: true}))})
            .setTimestamp()
            .setTitle("Erreur d'ajout de niveaux")
        ]})

        db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}' AND  user '${member.id}'`, async (err, req) => {

            if(req.length < 1) {
                db.query(`INSERT INTO xp (guild, user, xp, level) VALUES '${message.guildId}', '${member.id}', '0', '0'`)
                message.reply({embeds: [

                    new Discord.EmbedBuilder()
                    .setColor(bot.color)
                    .setDescription("Le membre vient d'être enregistré dans la base de donnés car il n'y été pas. Veuiller réssayer !")
                    .setFooter({text: `Gérée par l'instance de Peperehobbits01's bot`, iconURL: (bot.user.displayAvatarURL({dynamic: true}))})
                    .setTimestamp()
                    .setTitle("Erreur d'ajout de niveaux")
                ]})
            }

            for(let i = 0; i < req.length; i++) {

                let levelcalcul =+ parseInt(req[i].level) + parseInt(level);

                let Embed = new Discord.EmbedBuilder()
                    .setColor(bot.color)
                    .setDescription(`${message.user} a ajouté ${level} niveaux à ${member}.`)
                    .setFooter({text: `Gérée par l'instance de Peperehobbits01's bot`, iconURL: (bot.user.displayAvatarURL({dynamic: true}))})
                    .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    .setTitle("Niveaux ajouté")

                await db.query(`UPDATE xp SET level = '${levelcalcul}' WHERE guild = '${message.guildId}' AND user = '${member.id}'`)
                await message.reply({embeds: [Embed], ephemeral: false})   
            }
        })
    }
};