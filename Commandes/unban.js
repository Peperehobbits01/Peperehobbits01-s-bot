const Discord = require("discord.js")
const { EmbedBuilder } = require("discord.js")

module.exports = {

    name: "unban",
    description: "Débannir une personne.",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
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

    async run(bot, message, args, db) {

        

        let user = args.getUser("utilisateur")
        if(!user) return message.reply("Aucun utilisateur sélectionnée!")

        let id = args.getString("id")
        if(!id) return message.reply("Veuillez entrée une ID!")

        let reason = args.getString("raison")
        if(!reason) reason = "Debannie pour bonne conduite (raison auto ajouté)"

        if(!(await message.guild.bans.fetch()).get(user.id)) return message.reply("Il est déjà débanni!")
        
        try{
            const iphone = new Discord.EmbedBuilder()
            .setTitle("Informations du débanisement")
            .setDescription(`Vous avez été débannis par ${message.user.tag} pour la raison : \`${reason}\` avec succès !`)
            .setColor(bot.color)
            .setTimestamp()
            await user.send({embeds: [iphone]})
        }catch(err) {}

        await message.deferReply()
        //try {await user.send(`Tu as été débanni par ${message.user.tag} pour la raison ${reason}!`)} catch (err) {}

        let iphonee = new EmbedBuilder()
        .setColor(bot.color)
        .setTitle("Inforamtion débanisement")
        .setDescription(`Vous avez unban ${user.tag} pour la raison : \`${reason}\` avec succès !`)
        .setFooter({text: `Peperehobbits01's Bot instance`})

        await message.followUp({embeds: [iphonee], ephemeral: false})

        db.query(`SELECT * FROM ban WHERE guild = "${message.guild.id}" AND user = "${user.id}" AND ban = '${id}'`, async (err, req) => {
            if (req.length < 1) return message.reply('Aucune banisement pour ce membre/ID du ban invalide');
    
           db.query(`DELETE FROM ban WHERE guild = "${message.guild.id}" AND user = "${user.id}" AND ban = "${id}"`)
        })
            
        await message.guild.members.unban(user, reason)
    }
}