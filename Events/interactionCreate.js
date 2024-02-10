const Discord = require("discord.js")
const { executeQuery } = require("../Fonctions/databaseConnect.js") 

module.exports = async (bot, interaction, message) => {

    if(interaction.type === Discord.InteractionType.ApplicationCommand) {

        const command = bot.commands.get(interaction.commandName);
        command.run(bot, interaction, interaction.options, bot.db)

    }

    if(interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {

        let entry = interaction.options.getFocused()

        if(interaction.commandName === "help") {

            let choices = bot.commands.filter(cmd => cmd.name.includes(entry))
            await interaction.respond(entry === "" ? bot.commands.map(cmd => ({name: cmd.name, value: cmd.name})) : choices.map(choices => ({name: choices.name, value: choices.name})))
        }

        if(interaction.commandName === "set-statut") {

            let choices = ["Listening", "Watching", "Playing", "Streaming", "Competing"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }

        if(interaction.commandName === "addxp") {

            let choices = ["Level", "Xp"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }

        if(interaction.commandName === "clearxp") {

            let choices = ["Level", "Xp", "Tout effacer"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }

    }

    if (interaction.customId === "unwarn") {
        if(interaction.isButton()) {

            //if(!interaction.user.id.hasPermission("MANAGE_MESSAGES")) return message.reply({content: `Vous ne pouvez pas utiliser ce boutton !`, ephemeral: true});

            const queryUnwarnSearch = `SELECT * FROM warn WHERE guild = "${interaction.guild.id}" AND user = "${user.id}"`
            const ResultsUnwarn = await executeQuery(queryUnwarnSearch)
            if (ResultsUnwarn.length < 1) return interaction.reply('Aucune avertissements pour ce membre/ID du warn')

            const queryUnwarnDelete = `DELETE FROM warn WHERE guild = "${interaction.guild.id}" AND user = "${user.id}" AND warn = "${id}"`
            await executeQuery(queryUnwarnDelete)
        }
    }

    if (interaction.customId === "help") {
        if(interaction.isSelectMenu()) {
            const collector = interaction.createMessageComponentCollector()

            collector.on('collect', async interaction => {

            if(interaction.user.id !== interaction.user.id) return interaction.reply({content: `Vous ne pouvez pas utiliser ce menu!`, ephemeral: true})
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
                
            interaction.update({ embeds: [nouvelEmbed], components: [menuRow] })
            })
        }
    }
}
