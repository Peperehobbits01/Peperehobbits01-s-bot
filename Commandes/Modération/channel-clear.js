const Discord = require("discord.js")

module.exports = {

    name: "channel-clear",
    description: "Supprimer des messages dans un salon",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "🛡・Modération",
    options: [
        {
            type: "number",
            name: "nombre",
            description: "Le nombre de message à supprimer",
            required: true,
            autocomplete: false
        },{
            type: "channel",
            name: "salon",
            description: "Salon ou effacer les messages",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

        let channel = args.getChannel("salon")
        if(!channel) channel = message.channel;
        if(channel.id !== message.channel.id && !message.guild.channels.cache.get(channel.id)) return message.reply("Se salon n'existe pas!")

        let number = args.getNumber("nombre")
        if(parseInt(number) <= 0 || parseInt(number) > 100) return message.reply("Le bot n'est pas capable de gérée se nombre!")

        await message.deferReply()

        try {

            await channel.bulkDelete(parseInt(number))
            await message.channel.send({content: `Les messages sont supprimée!`})

        } catch (err) {

            let messages = [...(await channel.messages.fetch()).filter(msg => !msg.interaction && (Date.now() - msg.createdAt) <= 1209600000).values()]
            if(message.length <= 0) return message.channel.send("Aucun message à supprimer!")
            await channel.bulkDelete(messages)

            await message.channel.send({content: `Je n'ai pas pu tout supprimée car certain message date de plus de 14 jours!`})
        }
    }
}