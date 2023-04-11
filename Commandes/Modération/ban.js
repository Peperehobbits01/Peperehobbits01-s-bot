const Discord = require("discord.js")
const { EmbedBuilder } = require("discord.js")

module.exports = {

    name: "ban",
    description: "Bannir les personnes ne respectant pas les règles.",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category: "🛡・Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à bannir",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "raison",
            description: "La raison du bannissement",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {

        let user = args.getUser("membre")
        if(!user) return message.reply("Pas de membre à bannir!")
        let member = message.guild.members.cache.get(user.id)

        let reason = args.getString("raison")
        if(!reason) reason = "Non respect du règlement! (raison auto ajoutée)";

        if(message.user.id === user.id) return message.reply("Tu ne peux pas te bannir!")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("Le fondateur ne peux pas être banni!")
        if(member && !member.bannable) return message.reply("Je ne peux le bannir!")
        if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas le bannir!")
        if((await message.guild.bans.fetch()).get(user.id)) return message.reply("Il est déjà banni!")

        const Ban1 = new Discord.EmbedBuilder()
        .setTitle(`Vous avez été bannis ! `)
        .setDescription(`${message.user.tag} vous a bannis sur le serveur ${message.guild.name} pour la raison : \`${reason}\` ! `)
        .setColor(bot.color)
        .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
        await user.send({embeds: [Ban1]})

        await message.deferReply()
            
        //try {await user.send(`Tu as été banni du serveur ${message.guild.name} par ${message.user.tag} pour la raison : ${reason}`)} catch(err) {}

        const Ban2 = new Discord.EmbedBuilder()
        .setTitle("Informations du ban")
        .setDescription(`Vous avez ban ${user.tag} pour la raison : \`${reason}\` avec succès !`)
        .setColor(bot.color)
        .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
        await message.followUp({embeds: [Ban2], ephemeral : false})

        await message.guild.bans.create(user.id, {reason: reason})

        let ID = await bot.function.createId("BAN")
 
        db.query(`INSERT INTO ban (guild, user, author, ban, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)

    }
}