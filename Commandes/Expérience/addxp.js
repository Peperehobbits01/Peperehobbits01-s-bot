const Discord = require("discord.js")
const { executeQuery } = require("../../Fonctions/databaseConnect.js")

module.exports = {

    name: "addxp",
    description: "Donne des niveaux ou de l'expérience à un membre",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "📊・Système d'expérience",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à qui donner des niveaux.",
            required: true,
            autocomplete: false
        }, {
            type: "String",
            name: "ajouter",
            description: "Choisir si l'on veut ajouter de l'expérience ou des niveaux au membres sélectionner.",
            required: true,
            autocomplete: true
        },{
            type: "number",
            name: "combien",
            description: "Le montant à donner.",
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
            .setTitle("Erreur de la commande d'ajout dans le système d'expérience")
        ]})

        let addingchoice = args.getString("ajouter")
        if(!addingchoice) return message.reply({embeds: [

            new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setDescription("Indiquer un choix !")
            .setFooter({text: `Gérée par l'instance de Peperehobbits01's bot`, iconURL: (bot.user.displayAvatarURL({dynamic: true}))})
            .setTimestamp()
            .setTitle("Erreur de la commande d'ajout dans le système d'expérience")
        ]})

        let ToAdd = args.getNumber("combien")
        if(!ToAdd) return message.reply({embeds: [

            new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setDescription("Indiquer combien de nievaux à ajouter !")
            .setFooter({text: `Gérée par l'instance de Peperehobbits01's bot`, iconURL: (bot.user.displayAvatarURL({dynamic: true}))})
            .setTimestamp()
            .setTitle("Erreur de la commande d'ajout dans le système d'expérience")
        ]})

        const queryAddXpSearch = `SELECT * FROM xp WHERE guild = '${message.guildId}' AND  user '${member.id}'`
        const ResultsAddXpSearch = await executeQuery(queryAddXpSearch)

        if(ResultsAddXpSearch.length < 1) {
            const queryAddMember = `INSERT INTO xp (guild, user, xp, level) VALUES '${message.guildId}', '${member.id}', '0', '0'`
            await executeQuery(queryAddMember)
            message.reply({embeds: [

                new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setDescription("Le membre vient d'être enregistré dans la base de donnés car il n'y été pas. Veuiller réssayer !")
                .setFooter({text: `Gérée par l'instance de Peperehobbits01's bot`, iconURL: (bot.user.displayAvatarURL({dynamic: true}))})
                .setTimestamp()
                .setTitle("Erreur de la commande d'ajout dans le système d'expérience")
        ]})

        if(addingchoice === "Level") {

            for(let i = 0; i < ResultsAddXpSearch.length; i++) {

                let levelcalcul =+ parseInt(ResultsAddXpSearch[i].ToAdd) + parseInt(ToAdd);

                const SuccesAddXp = new Discord.EmbedBuilder()
                    .setColor(bot.color)
                    .setDescription(`${message.user} a ajouté ${ToAdd} niveaux à ${member}.`)
                    .setFooter({text: `Gérée par l'instance de Peperehobbits01's bot`, iconURL: (bot.user.displayAvatarURL({dynamic: true}))})
                    .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    .setTitle("Niveaux ajouté")

                const queryUpdateAddXp = `UPDATE xp SET level = '${levelcalcul}' WHERE guild = '${message.guildId}' AND user = '${member.id}'`
                await executeQuery(queryUpdateAddXp)
                await message.reply({embeds: [SuccesAddXp], ephemeral: false})   

            }} else if(addingchoice === "Xp") {

                for(let i = 0; i < ResultsAddXpSearch.length; i++) {

                    let xpcalcul =+ parseInt(ResultsAddXpSearch[i].ToAdd) + parseInt(ToAdd);
    
                    const SuccesAddXp = new Discord.EmbedBuilder()
                        .setColor(bot.color)
                        .setDescription(`${message.user} a ajouté ${ToAdd} expériences à ${member}.`)
                        .setFooter({text: `Gérée par l'instance de Peperehobbits01's bot`, iconURL: (bot.user.displayAvatarURL({dynamic: true}))})
                        .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        .setTitle("Niveaux ajouté")
    
                    const queryUpdateAddXp = `UPDATE xp SET xp = '${xpcalcul}' WHERE guild = '${message.guildId}' AND user = '${member.id}'`
                    await executeQuery(queryUpdateAddXp)
                    await message.reply({embeds: [SuccesAddXp], ephemeral: false})  
                }
            }
        }
    }
}