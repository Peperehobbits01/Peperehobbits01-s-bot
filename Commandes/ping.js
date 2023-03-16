const Discord = require('discord.js');

module.exports = {

    name: "ping",
    description: "Obtenez le ping/la latence du bot",
    dm: true,
    permission: "Aucune",
    category: "📚・Informations",

    async run(bot, message) {

        let reloadPing = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("ping")
                    .setEmoji("🔄")
                    .setLabel("Actualiser")
                    .setStyle(Discord.ButtonStyle.Success)
            )
        // Ping du membre qui requête la commande
        const pingUser = Date.now() - message.createdTimestamp;
        let emojiUser;
        if(pingUser <= 200) { emojiUser = "🟢" } 
        else if (pingUser <= 400 && pingUser >= 200) { emojiUser = "🟠" }
        else if(pingUser >= 400) {emojiUser = "🔴" };
        // Ping de l'API de discord
        const APIPing = bot.ws.ping;
        let APIemoji;
        if(APIPing <= 200) { APIemoji = "🟢" }
        else if(APIPing <= 400 && APIPing >= 200) { APIemoji = "🟠" }
        else if(APIPing >= 400) {APIemoji = "🔴" }

        let PingEmbed = new Discord.EmbedBuilder()
            .setTitle("Pong!")
            .setDescription(`
            \`${emojiUser}\` Pong ! | Votre ping : **${pingUser}ms**
            \`${APIemoji}\` Pong ! | API Discord ping : **${APIPing}ms**`)
            .setColor(bot.color)

        await message.reply({embeds: [PingEmbed], components: [reloadPing], ephemeral: false})
    }
}