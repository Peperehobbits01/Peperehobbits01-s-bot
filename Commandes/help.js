const Discord = require('discord.js');
const config = require('../config')
const { levenshteinDistance } = require('../Fonctions/levenshteinDistance')

module.exports = {

    name: "help",
    description: "Obtenez de l'aide",
    dm: false,
    permission: "Aucune",
    category: "📚・Informations",
    usage: "/help",
    options: [
        {
            type: "string",
            name: "commande",
            description: "La commande à rechercher",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

        const commande = args.getString('commande');

        if(!commande) {
            let categories = []
            let cat = []
            bot.commands.forEach(command => {
                if(!cat.includes(command.category)) cat.push(command.category)

                const categorieExistante = categories.some(category => category.value === command.category.toLowerCase() && category.label === command.category)

                if(!categorieExistante) categories.push({ label: command.category, value: command.category.toLowerCase() })
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
                menuOptions.push({ label: category, value: category.toLowerCase() })
            })

            let menu = new Discord.SelectMenuBuilder()
                .setCustomId("help")
                .setOptions(menuOptions)

            let menuRow = new Discord.ActionRowBuilder().addComponents(menu)

            let EmbedHelp = new Discord.EmbedBuilder()
                .setAuthor({ name: bot.user.username, iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
                .setColor(config.color).setTitle(`Menu help`)
                .setDescription(`
                Voici le menu help ! Vous n'avez cas cliquer sur la catégorie de commande correspondante et je serai ravi de vous aider !
                **/!\\ Je tiens a préciser que le menu help affiche seulement les commandes dont vous avez accès !**

                Catégories : \`${commandCategories.length}\`
                Commandes : \`${commands.size}\`
                `)
                .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({ text: bot.user.username, iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

            message.reply({ embeds: [EmbedHelp], components: [menuRow] }).then(msg => {

                const collector = msg.createMessageComponentCollector()

                collector.on('collect', async interaction => {
                    if (interaction.isSelectMenu()) {
                        if(interaction.user.id !== message.user.id) return interaction.reply({content: `Vous ne pouvez pas utiliser ce select menu !`, ephemeral: true})
                        const category = interaction.values[0];
                        const categoryCommands = commands.filter(command => command.category.toLowerCase() === category)
                        const commandString = categoryCommands.map(command => `**${command.name}** : \`${command.description}\``).join('\n')

                        const nouvelEmbed = new Discord.EmbedBuilder()
                            .setTitle(`Commandes de la catégorie ${category.toLowerCase()}`)
                            .setDescription(`${commandString}`)
                            .setColor(config.color)
                            .setFooter({ text: bot.user.username, iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                            .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
                            .setAuthor({ name: bot.user.username, iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

                        interaction.update({ embeds: [nouvelEmbed], components: [menuRow] })
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
            .setColor(config.color)
            .setTitle(`Commande ${command.name}`)
            .setDescription(`Nom : \`${command.name}\`\nDescription : \`${command.description}\`\nPermissions requises : \`${typeof command.permission !== "bigint" ? command.permission: new Discord.PermissionsBitField(command.permission).toArray(false)}\`\nCatégorie : \`${command.category}\`\nUtilisation : \`${command.usage}\`\nDM autorisé : \`${command.dm ? "Oui" : "Non"}\`\n`)
            .setThumbnail(`${bot.user.displayAvatarURL({dynamic: true})}`)
            .setTimestamp()
            .setFooter({text: `Commandes de ${bot.user.username}`})

            await message.reply({embeds: [EmbedCommande], ephemeral: true})
        }
    }
}