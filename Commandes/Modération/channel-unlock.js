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
        let channel = args.getChannel("salon")
        let c = message.guild.channels.cache.get(channel.id)
        if(!channel) return message.reply(`**Le salon n'a pas été trouvé**`)
        if(!c) return message.reply(`**Le salon n'a pas été trouvé**`)

        c.permissionOverwrites.create(message.guild.roles.everyone, {
            SendMessages: true
          })

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