const Discord = require("discord.js")
const ms = require("ms")
const { executeQuery } = require("../../Fonctions/databaseConnect.js")

module.exports = {

    name: "mute",
    description: "Mute un membre",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: "🛡・Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à mute",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "temps",
            description: "Le temps du mute",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "raison",
            description: "La raison du mute",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {

        let user = args.getUser("membre")
        if(!user) return message.reply("Aucun membre sélectionée!")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Aucun membre sélectionnée!")

        let time = args.getString("temps")
        if(!time) return message.reply("Aucun temps donnée!")
        if(isNaN(ms(time))) return message.reply("'Mauvais format!")
        if(ms(time) > 2419200000) return message.reply("Le bot ne peux pas mute autant de temps!")

        let reason = args.getString("raison")
        if(!reason) reason = "Non respect des règles (raison auto ajouté)";

        if(message.user.id === user.id) return message.reply("Tu ne peux pas te mute!")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas mute le fondateur!")
        if(!member.moderatable) return message.reply("Je ne peux pas le mute!")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas le mute!")
        if(member.isCommunicationDisabled()) return message.reply("Il est déjà muet!")

        try{
            const Mute1 = new Discord.EmbedBuilder()
            .setTitle(`Vous avez été mute ! `)
            .setDescription(`${message.user.tag} vous a mute sur le serveur ${message.guild.name} pour la raison : \`${reason}\`, et il dureras :  \`${time}\` ! `)
            .setColor(process.env.BOT_COLOR)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
            
            await user.send({embeds: [Mute1]})
        }catch(err) {}

        await message.deferReply()

        const Mute2 = new Discord.EmbedBuilder()
        .setTitle("Informations du mute")
        .setDescription(`Vous avez mute ${user.tag} pour la raison : \`${reason}\` et le temps : \`${time}\` avec succès !`)
        .setColor(process.env.BOT_COLOR)
        .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

        await message.followUp({embeds: [Mute2]})

        let ID = await bot.function.createId("MUTE")
 
        const queryMuteAdd = `INSERT INTO mute (guild, user, author, mute, reason, date, time) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}', '${time}')`
        await executeQuery(queryMuteAdd)

        await member.timeout(ms(time), reason)
    }
}