const Discord = require("discord.js");

module.exports = {
    name: "help",
    description: "Affiche les commandes du bot",
    permission: Discord.PermissionFlagsBits.SendMessages,
    dm: false,
    category: "Information",
    options: [
        {
            type: "string",
            name: "commande",
            description: "La commande à afficher",
            required: false,
            autocomplete: true
        }
    ],

    async run(bot, interaction, args) {

        let command;
        if (args.getString("commande")) {
            command = bot.commands.get(args.getString("commande"));
            if (!command) return interaction.reply("Cette commande n'existe pas !");
        }

        if (!command) {

            const activCmds = bot.commands.map(cmd => interaction.member.permissions.has(new Discord.PermissionsBitField(cmd.permission)));
            const sortie = activCmds.filter(c => c === true);

            const categories = [];
            bot.commands.forEach(command => {

                if (!categories.includes(command.category)) categories.push(command.category);
            })

            const Embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`Commandes du bot`)
                .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`Commandes du bot : \`${bot.commands.size}\`\nCommandes disponibles pour ${interaction.member} : \`${sortie.length}\``)
                .setTimestamp()
                .setFooter({ text: `${bot.user.username} - help`, iconURL: bot.user.displayAvatarURL({ dynamic: true }) });

            await categories.sort().forEach(async cat => {
                const commands = bot.commands.filter(cmd => cmd.category === cat);
                const categoryEmpty = commands.map(cmd => interaction.member.permissions.has(new Discord.PermissionsBitField(cmd.permission)));

                if (categoryEmpty.every(element => element === false)) return;
                Embed.addFields({
                    name: `${cat}`, value: `>>> ${commands.map(cmd => `${interaction.member.permissions.has(new Discord.PermissionsBitField(cmd.permission)) ? `\`/${cmd.name}\` : ${cmd.description}\n` : ""}`).join("")}`
                });
            });
            await interaction.reply({ embeds: [Embed], ephemeral: true });


        } else {
            const Embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`Commandes ${command.name}`)
                .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`Nom : \`/${command.name}\`\nDescription : \`${command.description}\`\nPermission requise : \`${typeof command.permission !== "bigint" ? command.permission : new Discord.PermissionsBitField(command.permission).toArray(false)}\`\nCommande en DM : \`${command.dm ? "Oui" : "Non"}\`\nOwner bot only : \`${command.ownerOnly ? "Oui" : "Non"}\`\nCatégorie : ${command.category}`)
                .setTimestamp()
                .setFooter({ text: `${bot.user.username} - help`, iconURL: bot.user.displayAvatarURL({ dynamic: true }) });

            await interaction.reply({ embeds: [Embed], ephemeral: true });
        };
    }

};