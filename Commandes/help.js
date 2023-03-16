const Discord = require("discord.js")

module.exports = {

    name: "help",
    description: "Affiche toute les commandes du bot.",
    permission: "Aucune",
    category: "📚・Informations",
    dm: false,
    options: [
        {
            type: "string",
            name: "commande",
            description: "La commande à afficher",
            required: false,
            autocomplete: true
        }
    ],

    async run(bot, message, args) {
        
        let command;
        if(args.getString("commande")) {
            command = bot.commands.get(args.getString("commande"));
            if(!command) return message.reply("Cette commande n'héxiste pas !")
        }

        if(!command) {


            let categories = [];
            bot.commands.forEach(command => {
                if(!categories.includes(command.category)) categories.push(command.category)
            })

            let Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle(`Commande de Peperehobbits01's Bot`)
            .setThumbnail(bot.user.displayAvatarURL({dynamic : true}))
            .setDescription(`Commande disponible : \`${bot.commands.size}\`\nCatégories disponibles : \`${categories.length}\``)
            .setTimestamp()
            .setFooter({text : "Peperehobbits01's Bot instance",})

            await categories.sort().forEach(async cat => {

                let commands = bot.commands.filter(cmd => cmd.category === cat)
                Embed.addFields({name: `${cat}`, value: `${commands.map(cmd => `\`${cmd.name}\` : ${cmd.description}`).join("\n")}`})
            })

            await message.reply({embeds : [Embed]})
        
        
        } else {
            
            let Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle(`Commande ${command.name}`)
            .setThumbnail(bot.user.displayAvatarURL({dynamic : true}))
            .setDescription(`Nom : \`${command.name}\`\nDescription : \`${command.description}\`\nPermissions requise : \`${typeof command.permission !== "hight" ? command.permisions : new Discord.PermissionsBitField(command.permissions).toArray(false)}\`\n Catégorie : \`${command.category}\``)
            .setTimestamp()
            .setFooter({text : "Peperehobbits01's Bot instance"})

            await message.reply({embeds : [Embed]})
        }
    }
}