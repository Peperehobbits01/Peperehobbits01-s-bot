const Discord = require("discord.js")

module.exports = async (bot, interaction, client, inter, db, message) => {

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

    }

    if(interaction.type === Discord.InteractionType.ApplicationCommand) {

        let command = require(`../Commandes/${interaction.commandName}`)
        command.run(bot, interaction, interaction.options, bot.db)
        
    }

    if (interaction.isButton()) {
        if (interaction.customId === "rule") {
                    
            let role = "931457929431908376"
            if(!role) return;
            await interaction.member.roles.add(role)

            await interaction.reply({content: "Vous avez bien acceptée le règlement", ephemeral: true})
    
        }
    }

    if(interaction.customId === "ping") {

        let reloadPing = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("ping")
                .setEmoji("🔄")
                .setLabel("Actualiser")
                .setStyle(Discord.ButtonStyle.Success)
        )
        const pingUser = Date.now() - interaction.createdTimestamp;
            let emojiUser;
            if(pingUser < 200) { emojiUser = "🟢" } 
            else if (pingUser < 400 && pingUser > 200) { emojiUser = "🟠" }
            else if(pingUser > 400) {emojiUser = "🔴" };
            // Ping de l'API de discord
            const APIPing = bot.ws.ping;
            let APIemoji;
            if(APIPing < 200) { APIemoji = "🟢" }
            else if(APIPing < 400 && APIPing > 200) { APIemoji = "🟠" }
            else if(APIPing > 400) {APIemoji = "🔴" }

        let PingEmbed = new Discord.EmbedBuilder()
            .setTitle("Pong !")
            .setDescription(`
            \`${emojiUser}\` Pong ! | Votre ping : **${pingUser}ms**
            \`${APIemoji}\` Pong ! | API Discord ping : **${APIPing}ms**`)
            .setColor(bot.color)

        await interaction.deferUpdate()
        await interaction.editReply({embeds: [PingEmbed], components: [reloadPing]})
    }

    if(interaction.customId === "help") {

    let menu = new Discord.SelectMenuBuilder()
                    .setCustomId("help")

    let menuRow = new Discord.ActionRowBuilder().addComponents(menu)

    }

    if(interaction.customId === "unwarn") {

    const unwarn = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId("unwarn")
                        .setEmoji()
                        .setLabel("Retirée l'avertisement")
                        .setStyle(Discord.ButtonStyle.Success)
                )

    db.query(`DELETE FROM warn WHERE guild = "${interaction.guild.id}" AND user = "${user.id}" AND warn = "${id}"`)
    if(interaction.user.id !== message.user.id) return interaction.reply({content: `Vous ne pouvez pas utiliser ce boutton !`, ephemeral: true});
    }
}
