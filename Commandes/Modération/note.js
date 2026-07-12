const Discord = require("discord.js")
const { executeQuery } = require("../../Fonctions/databaseConnect.js")

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

    async run(bot, message, args) {

        let user = args.getUser("membre")
        if(!user) return message.reply("Aucun membre a notée.")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Aucun membre a notée.")

        let reason = args.getString("note")
        if(!reason) return message.reply("Note manquante.")

        if(message.user.id === user.id) return message.reply("Tu ne peux pas te notée !")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("Le fondateur ne peux pas être notée !")
        if(member && !member.kickable) return message.reply("Je ne peux le notée !")
        if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas le notée !")

        await message.deferReply()

        const Note1 = new Discord.EmbedBuilder()
        .setTitle("Informations de la note")
        .setDescription(`Vous avez mis une note à ${user.tag} et voici sa note : \`${reason}\` avec succès !`)
        .setColor(process.env.BOT_COLOR)
        .setFooter({
            text: "Gérée par l'instance de Peperehobbits01's Bot",
            iconURL: bot.user.displayAvatarURL({dynamic: true})
        })
        await message.followUp({embeds: [Note1]})

        let ID = await bot.function.createId("NOTE")
 
        const queryNoteAdd = `INSERT INTO note (guild, user, author, note, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`
        await executeQuery(queryNoteAdd)
    }
}