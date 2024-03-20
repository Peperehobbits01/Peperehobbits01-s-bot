const Discord = require("discord.js");
const { executeQuery } = require("../../Fonctions/databaseConnect")

module.exports = {
    name: "clearxp",
    description: "Effacer l'expérience d'un membre",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "📊・Système d'expérience",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à qui effacer son expérience.",
            required: true,
            autocomplete: false
        }, {
            type: "String",
            name: "clear",
            description: "Choisir ce que l'on effacer de la base de donnée pour le membres sélectionnée",
            required: true,
            autocomplete: true
        }
    ],

    async run(bot, message, args) {

        const member = args.getMember("membre")
        if(!member) return message.reply({embeds: [

            new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setDescription("Indiquer un membre !")
            .setFooter({text: `Gérée par l'instance de Peperehobbits01's bot`, iconURL: (bot.user.displayAvatarURL({dynamic: true}))})
            .setTimestamp()
            .setTitle("Erreur de la commande d'effacement dans le système d'expérience")
        ]})

        const clearchoice = args.getString("clear")
        if(!clearchoice) return message.reply({embeds: [

            new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setDescription("Indiquer ce que vous voulez effacée !")
            .setFooter({text: `Gérée par l'instance de Peperehobbits01's bot`, iconURL: (bot.user.displayAvatarURL({dynamic: true}))})
            .setTimestamp()
            .setTitle("Erreur de la commande d'effacement dans le système d'expérience")
        ]})

        await message.deferReply()

        if(clearchoice === "Level") {

            const queryLevelClearSearch = `SELECT * FROM xp WHERE guild = '${message.guildId}' AND  user '${member.id}'`
            const LevelClearResults = await executeQuery(queryLevelClearSearch)

            if(LevelClearResults.length < 1) return message.reply(`Le membre ${member.user.tag} n'est pas dans la base de donnée!`)

            const queryLevelClear = `UPDATE xp SET level = 0 WHERE guild = '${message.guildId}' AND user = '${member.id}'`
            await executeQuery(queryLevelClear)

            const succesLevelClear = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle("Effacement des niveaux du membres réussite.")
            .setDescription(`Les niveaux du membre ${member.user.tag} ont bien été supprimée!`)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.newState.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

            await message.followUp({embeds: [succesLevelClear]})
            
        } else if(clearchoice === "Xp") {

            const queryXpClearSearch = `SELECT * FROM xp WHERE guild = '${message.guildId}' AND  user '${member.id}'`
            const XpClearResults = await executeQuery(queryXpClearSearch)

            if(XpClearResults.length < 1) return message.reply(`Le membre ${member.user.tag} n'est pas dans la base de donnée!`)

            const queryXpClear = `UPDATE xp SET xp = 0 WHERE guild = '${message.guildId}' AND user = '${member.id}'`
            await executeQuery(queryXpClear)

            const succesXpClear = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle("Effacement de l'expérience du membres réussite.")
            .setDescription(`L'expérience du membre ${member.user.tag} a bien été supprimée!`)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.newState.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

            await message.followUp({embeds: [succesXpClear]})

        } else if(clearchoice === "Tout effacer") {

            const queryAllClearSearch = `SELECT * FROM xp WHERE guild = '${message.guildId}' AND  user '${member.id}'`
            const AllClearResults = await executeQuery(queryAllClearSearch)
            
            if(AllClearResults.length < 1) return message.reply(`Le membre ${member.user.tag} n'est pas dans la base de donnée!`)

            const queryAllClear = `DELETE FROM xp WHERE guild = '${message.guildId}' AND user = '${member.id}'`
            await executeQuery(queryAllClear)

            const succesAllClear = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle("Effacement du membre de la base de donnée réussite.")
            .setDescription(`Le membre ${member.user.tag} a bien été effacer de la base de donnée!`)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.newState.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

            await message.followUp({embeds: [succesAllClear]})
        }
    }
};