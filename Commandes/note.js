const Discord = require("discord.js")

module.exports = {

    name: "note",
    description: "Mettre une note sur un membre.",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    category: "🛡・Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à notée",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "note",
            description: "La note à mettre",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {

        let user = args.getUser("membre")
        if(!user) return message.reply("Pas de membre à notée!")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Pas de membre à notée.")

        let reason = args.getString("note")
        if(!reason) reason = "Note manquante";

        if(message.user.id === user.id) return message.reply("Tu ne peux pas te notée!")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("Le fondateur ne peux pas être notée!")
        if(member && !member.kickable) return message.reply("Je ne peux le notée!")
        if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas le notée!")

        await message.deferReply()

        //try {await user.send(`Tu as été expulsé/kick du serveur ${message.guild.name} par ${message.user.tag} pour la raison : ${reason}`)} catch(err) {}

        const iphonee = new Discord.EmbedBuilder()
        .setTitle("Informations de la note")
        .setDescription(`Vous avez mis une note à ${user.tag} et voici sa note : \`${reason}\` avec succès !`)
        .setColor(bot.color)
        .setTimestamp()
        await message.followUp({embeds: [iphonee], ephemeral : false})

        //await message.reply(`${message.user} a expulsé/kick ${user.tag}`)

        let ID = await bot.function.createId("NOTE")
 
        db.query(`INSERT INTO note (guild, user, author, note, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)
        
    }
}