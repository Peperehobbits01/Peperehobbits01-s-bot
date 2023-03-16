const Discord = require("discord.js")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: "channel-unlock",
    description: "Permet d'ouvrir un salon",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    category: "🛡・Modération",
    dm: false,
    options: [
        {
            type: "channel",
            name: "salon",
            description: "le salon a ouvrir",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "raison",
            description: "la raison du unlock",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {
        let channel = args.getChannel("salon")
        let c = message.guild.channels.cache.get(channel.id)
        if(!channel) return message.reply(`**Le salon n'a pas été trouvé**`)
        if(!c) return message.reply(`**Le salon n'a pas été trouvé**`)
        let reason = args.getString('raison')
        if(!reason) reason = "Pas de raison fournie"

        c.permissionOverwrites.create(message.guild.roles.everyone, {
            SendMessages: true
          })

          let Embed = new EmbedBuilder()
            .setColor(bot.color)
            .setTitle("Inforamtion unlock")
            .setDescription(`Réalisée: \`${message.user.username}\`\nRaison: \`${reason}\``)
            .setFooter({text: `Peperehobbits01's Bot instance`})

            await message.reply({embeds: [Embed], ephemeral: false})
    }
}