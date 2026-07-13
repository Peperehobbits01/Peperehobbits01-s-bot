const Discord = require("discord.js")
const { executeQuery } = require("../../Fonctions/databaseConnect")

module.exports = {

    name: "unban",
    description: "Débannir une personne.",
    permission: Discord.PermissionFlagsBits.BanMembers,
    category: "🛡・Modération",
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "L'utilisateur à débannir",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "id",
            description: "L'ID du ban",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "raison",
            description: "La raison du débannissement",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

        let user = args.getUser("utilisateur")
        if(!user) return message.reply("Aucun utilisateur sélectionnée!")

        let id = args.getString("id")
        if(!id) return message.reply("Veuillez entrée une ID!")

        let reason = args.getString("raison")
        if(!reason) reason = "Debannie pour bonne conduite (raison auto ajouté)"

        if(!(await message.guild.bans.fetch()).get(user.id)) return message.reply("Il est déjà débanni!")
        
        try{
            const Unban1 = new Discord.EmbedBuilder()
            .setTitle("Informations du débanisement")
            .setDescription(`Vous avez été débannis par ${message.user.tag} pour la raison : \`${reason}\` avec succès !`)
            .setColor(process.env.BOT_COLOR)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

            await user.send({embeds: [Unban1]})
        }catch(err) {}

        await message.deferReply()

        let Unban2 = new Discord.EmbedBuilder()
        .setColor(process.env.BOT_COLOR)
        .setTitle("Inforamtion débanisement")
        .setDescription(`Vous avez unban ${user.tag} pour la raison : \`${reason}\` avec succès !`)
        .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

        await message.followUp({embeds: [Unban2]})

        const querySearch = `SELECT * FROM ban WHERE guild = "${message.guild.id}" AND user = "${user.id}" AND ban = '${id}'`
        const results = await executeQuery(querySearch)
        if(results.length < 1) return message.reply('Aucune banisement pour ce membre/ID du ban invalide');
    
        const queryBanRemove = `DELETE FROM ban WHERE guild = "${message.guild.id}" AND user = "${user.id}" AND ban = "${id}"`
        await executeQuery(queryBanRemove)
            
        await message.guild.members.unban(user, reason)
    }
}