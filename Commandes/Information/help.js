const Discord = require('discord.js');
const { levenshteinDistance } = require('.../Fonctions/levenshteinDistance')

module.exports = {

    name: "help",
    description: "Obtenez de l'aide",
    dm: false,
    permission: "Aucune",
    category: "📚・Informations",
    options: [
        {
            type: "string",
            name: "commande",
            description: "La commande à rechercher",
            required: false,
            autocomplete: true
        }
    ],

    async run(bot, message, args) {

        const commande = args.getString('commande');

        if(!commande) {
            let categories = []
            let cat = []
            bot.commands.forEach(command => {
                if(!cat.includes(command.category)) cat.push(command.category)

                const categoriesExistante = categories.some(category => category.value === command.category.toLowerCase() && category.label === command.category)

                if(!categoriesExistante) categories.push({ label: command.category, value: command.category.toLowerCase() })
            })

            let commands = bot.commands.filter(command => {
                if(command.permission === "Aucune") {
                    return true;
                } else {
                    return message.member.permissions.has(command.permission);
                }
            });

            let commandCategories = []
            commands.forEach(command => {
                if (!commandCategories.includes(command.category)) {
                    commandCategories.push(command.category)
                }
            })

            let menuOptions = []
            commandCategories.forEach(category => {
                menuOptions.push({ label: category, value: category.toUpperCase() })
            })

            let menu = new Discord.SelectMenuBuilder()
                .setCustomId("help")
                .setOptions(menuOptions)

            let menuRow = new Discord.ActionRowBuilder().addComponents(menu)

            let EmbedHelp = new Discord.EmbedBuilder()
                .setColor(bot.color).setTitle(`Menu d'aide'`)
                .setDescription(`
                Voici le menu d'aide ! Vous n'avez cas cliquer sur la catégorie de commande correspondante et je serai ravi de vous aider !
                **\ :warning: Je tiens a préciser que le menu d'aide affiche seulement les commandes auquel vous avez accès !**

                Catégories : \`${commandCategories.length}\`
                Commandes : \`${commands.size}\`
                `)
                .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

            message.reply({ embeds: [EmbedHelp], components: [menuRow] }).then(msg => {

                const collector = msg.createMessageComponentCollector()

                collector.on('collect', async interaction => {
                    if (interaction.isSelectMenu(customId === "help")) {
                        if(message.user.id !== message.user.id) return message.reply({content: `Vous ne pouvez pas utiliser ce menu!`, ephemeral: true})
                        const category = interaction.values[0];
                        const categoryCommands = commands.filter(command => command.category.toLowerCase() === category)
                        const commandString = categoryCommands.map(command => `**${command.name}** : \`${command.description}\``).join('\n')

                        const nouvelEmbed = new Discord.EmbedBuilder()
                            .setTitle(`Commandes de la catégorie ${category.toLowerCase()}`)
                            .setDescription(`${commandString}`)
                            .setColor(bot.color)
                            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                            .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))

                        message.update({ embeds: [nouvelEmbed], components: [menuRow] })
                    }
                })
            })
        } else {

            const commandes = []
            bot.commands.forEach(command => {
                commandes.push(command.name)
            })

            let minDistance = Number.MAX_SAFE_INTEGER;
            let commandeProche = "";

            commandes.forEach((word) => {
                const distance = levenshteinDistance(word, commande);

                if (distance < minDistance) {
                    minDistance = distance;
                    commandeProche = word;
                }
            });

            const command = bot.commands.get(commandeProche)
            if(!command) return message.reply({content: `Aucune commande correspondante à ${commande} n'a été trouvée !`, ephemeral: true})

            let EmbedCommande = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle(`Commande ${command.name}`)
            .setDescription(`Nom : \`${command.name}\`\nDescription : \`${command.description}\`\nPermissions requises : \`${typeof command.permission !== "bigint" ? command.permission: new Discord.PermissionsBitField(command.permission).toArray(false)}\`\nCatégorie : \`${command.category}\`\nDM autorisé : \`${command.dm ? "Oui" : "Non"}\`\n`)
            .setThumbnail(`${bot.user.displayAvatarURL({dynamic: true})}`)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

            await message.reply({embeds: [EmbedCommande], ephemeral: false})
        }
    }
}