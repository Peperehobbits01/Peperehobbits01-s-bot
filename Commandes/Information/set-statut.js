const Discord = require("discord.js")

module.exports = {
    name: "set-statut",
    description: "Permet de mettre un statut et une activité à votre bot",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "📚・Informations",
    options:[
        {
            type: "string",
            name: "activite",
            description: "A quoi joue le robot ?",
            required: true,
            autocomplete: true
        }, {
            type: "string",
            name: "statut",
            description: "Le statut du robot.",
            required: false,
            autocomplete: false
        }, {
            type: "string",
            name: "lien",
            description: "URL du stream",
            required: false,
            autocomplete: false
        }
    ],
    async run(bot, message, args) {
        
        let activity = args.getString("activite")
        if(activity !== "Listening" && activity !== "Playing" && activity !== "Competing" && activity !== "Watching" && activity !== "Streaming") return message.reply("Aucun statut sélectionnée!")

        let statut = args.getString("statut")

        if(activity === "Streaming" && args.getString("lien") === null && !args.getString("lien"))
        if(activity === "Streaming" && !args.getString("lien").match(new RegExp(/^(?:https?:\/\/)?(?:www\.|go\.)?twitch\.tv\/([a-z0-9_]+)($|\?)/))) return message.reply("URL manquante!")
        
        if(activity === "Streaming") await bot.user.setActivity(statut, {type: Discord.ActivityType[activity], url: args.getString("lien")})
        await bot.user.setActivity(statut, {type: Discord.ActivityType[activity], url: args.getString("lien") ? args.getString("lien") : null})

        let Setstatut = new Discord.EmbedBuilder()
        .setColor(process.env.BOT_COLOR)
        .setTitle("ℹ️ Information changement du statut ℹ️")
        .setDescription(`Activité : ${activity}\nStatut : ${statut}`)
        .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

        message.reply({ embeds: [Setstatut] })
    }
}