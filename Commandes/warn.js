const Discord = require("discord.js")
 
module.exports = {
 
    name: "warn",
    description: "Warn un membre ",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: "🛡・Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre a avertir",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "raison",
            description: "La raison de l'avertisement",
            required: false,
            autocomplete: false
        }
    ],
 
    async run(bot, message, args, db) {
 
        let user = args.getUser("membre")
        if(!user) return message.reply("Aucun utilisateur sélectionnée!")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Aucun utilisateur sélectionnée!")
 
        let reason = args.getString("raison")
        if (!reason) reason = "Pas de raison fournie !"
 
        if(message.user.id === user.id) return message.reply("Essaie pas de te warn ! ")
 
        const iphone = new Discord.EmbedBuilder()
        .setTitle(`Vous avez été avertie ! `)
        .setDescription(`${message.user.tag} vous a averti sur le serveur ${message.guild.name} pour la raison : \`${reason}\` ! `)
        .setColor(bot.color)
        .setTimestamp()
        await user.send({embeds: [iphone]})

        let ID = await bot.function.createId("WARN")
 
        db.query(`INSERT INTO warn (guild, user, author, warn, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)

        await message.deferReply()

        /*try { await user.send(`${message.user.tag} vous a warn sur les serveur ${message.guild.name} pour la raison : \`${reason}\` ! `) } catch (err) {}*/
 
        const iphonee = new Discord.EmbedBuilder()
        .setTitle("Informations du warn")
        .setDescription(`Vous avez warn ${user.tag} pour la raison : \`${reason}\` avec succès !`)
        .setColor(bot.color)
        .setTimestamp()
        await message.followUp({embeds: [iphonee], ephemeral : false})
 
        /*await message.reply(`Vous avez warn ${user.tag} pour la raison : \`${reason}\` avec succès !`)*/
 
    }       
}