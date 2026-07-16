const Discord = require("discord.js")

module.exports = {
    name: "channel-unlock",
    description: "Permet d'ouvrir un salon",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    category: "🛡・Modération",
    options: [
        {
            type: "channel",
            name: "salon",
            description: "le salon a ouvrir",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {
        let channel = message.guild.channels.cache.get(args.getChannel("salon").id)
        if(!channel) return message.reply({content: `Le salon n'a pas été trouvé !`})

        await channel.permissionOverwrites.create(message.guild.roles.everyone, {
            SendMessages: true
        })

        let Unlockmessage = new Discord.EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setTitle("Ce salon vient d'être déverrouiller !")
            .setDescription(`Ce salon a été fermé par ${message.user}.`)
            .setFooter({
                text: "Gérée par l'instance de Peperehobbits01's Bot",
                iconURL: bot.user.displayAvatarURL({dynamic: true})
            })
            .setTimestamp()

        await channel.send({embeds: [Unlockmessage]})

        let Unlock = new Discord.EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setTitle("Information unlock")
            .setDescription(`Réalisée: \`${message.user.username}\`\nDate: \`${Date.now}\``)
            .setFooter({
                text: "Gérée par l'instance de Peperehobbits01's Bot",
                iconURL: bot.user.displayAvatarURL({dynamic: true})
            })

        await message.reply({embeds: [Unlock]})
    }
}