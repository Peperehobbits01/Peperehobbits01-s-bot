const Discord = require("discord.js")
const { executeQuery } = require("../../Fonctions/databaseConnect.js")

module.exports = {

    name: "kick",
    description: "Expulse les personnes ne respectant pas les règles.",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    category: "🛡・Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à kick",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "raison",
            description: "La raison de l'expulsion",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

        let user = args.getUser("membre")
        if(!user) return message.reply("Aucun membre a expulsé.")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Aucun membre a expulsé.")

        let reason = args.getString("raison")
        if(!reason) reason = "Non respect du règlement ! (raison auto ajoutée)";

        if(message.user.id === user.id) return message.reply("Tu ne peux pas t'expulsé !")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("Le fondateur ne peux pas être banni !")
        if(member && !member.kickable) return message.reply("Je ne peux l'expulsé !")
        if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas l'expulsé !")
        
        try{
            const Kick1 = new Discord.EmbedBuilder()
            .setTitle(`Vous avez été expulsée ! `)
            .setDescription(`${message.user.tag} vous a expulsée sur le serveur ${message.guild.name} pour la raison : \`${reason}\` ! `)
            .setColor(process.env.BOT_COLOR)
            .setFooter({
                text: "Gérée par l'instance de Peperehobbits01's Bot",
                iconURL: bot.user.displayAvatarURL({dynamic: true})
            })
    
            await user.send({embeds: [Kick1]})
        } catch(err) {}

        await message.deferReply()

        const Kick2 = new Discord.EmbedBuilder()
        .setTitle("Informations du kick")
        .setDescription(`Vous avez kick ${user.tag} pour la raison : \`${reason}\` avec succès !`)
        .setColor(process.env.BOT_COLOR)
        .setFooter({
            text: "Gérée par l'instance de Peperehobbits01's Bot",
            iconURL: bot.user.displayAvatarURL({dynamic: true})
        })

        await message.followUp({embeds: [Kick2]})

        await member.kick(reason)

        let ID = await bot.function.createId("KICK")
 
        const queryKickAdd = `INSERT INTO kick (guild, user, author, kick, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`
        await executeQuery(queryKickAdd)
    }
}

