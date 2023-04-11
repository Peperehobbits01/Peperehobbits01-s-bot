const Discord = require("discord.js")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: "channel-lock",
    description: "Permet de fermer un salon",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    category: "🛡・Modération",
    dm: false,
    options: [
        {
            type: "channel",
            name: "salon",
            description: "le salon a fermer",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "raison",
            description: "la raison du lock",
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
            SendMessages: false
          })
        
          let Lock = new EmbedBuilder()
            .setColor(bot.color)
            .setTitle("Inforamtion lock")
            .setDescription(`Réalisée: \`${message.user.username}\`\nRaison: \`${reason}\``)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
        
            await message.reply({embeds: [Lock], ephemeral: false})
    }
}