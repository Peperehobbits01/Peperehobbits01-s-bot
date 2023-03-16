const { PermissionFlagsBits } = require('discord.js');
module.exports = {

    name: "unwarn",
    description: "Permet de supprimer un avertissement d'un membre",
    dm: false,
    category: "🛡・Modération",
    permission: PermissionFlagsBits.ManageMessages,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre dont vous voulez souhaitez supprimer l'avertissement",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "id",
            description: "ID du warn que vous voulez supprimer",
            required: true,
            autocomplete: false
        }   

    ],

    async run(client, interaction, args, db) {
        
        try{ 
        
        let user = await client.users.fetch(interaction.options.get('membre').value);
        if (!user) return interaction.reply('Pas de membre à averti')
        let member = interaction.guild.members.cache.get(user.id);
        if (!member) return interaction.reply('Pas de membre à averti')

        let id = args.get('id').value

        if (interaction.user.id === user.id) return interaction.reply('Vous ne pouvez pas supprimer vos avertissments');
        if ((await interaction.guild.fetchOwner()).id === user.id) return interaction.reply('Vous ne pouvez pas supprimer les avertissements du propriétaire du serveur');
        if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return interaction.reply('Tu ne peux pas supprimer les avertissements de ce membre');
        if ((await interaction.guild.members.fetchMe()).roles.highest.comparePositionTo(member.roles.highest) <= 0) return interaction.reply('Le bot ne peut pas supprimer les avertissements de ce membre');

        db.query(`SELECT * FROM warn WHERE guild = "${interaction.guild.id}" AND user = "${user.id}" AND warn = '${id}'`, async (err, req) => {
            if (req.length < 1) return interaction.reply('Aucune avertissements pour ce membre/ID du warn invalide');

           db.query(`DELETE FROM warn WHERE guild = "${interaction.guild.id}" AND user = "${user.id}" AND warn = "${id}"`)
        })

        const iphone = new Discord.EmbedBuilder()
        .setTitle(`Un avertisement a été retirée! `)
        .setDescription(`${message.user.tag} vous a retirée un avertisement sur le serveur ${message.guild.name} ! `)
        .setColor(bot.color)
        .setTimestamp()
        await user.send({embeds: [iphone]})

        await message.deferReply()

        const iphonee = new Discord.EmbedBuilder()
        .setTitle("Informations du retrait d'avertisement")
        .setDescription(`Vous avez retirée l'avertisement de ${user.tag} avec succès !`)
        .setColor(bot.color)
        .setTimestamp()
        await message.followUp({embeds: [iphonee], ephemeral : false})

        } catch (err) {

            return message.reply("Pas de membre averti!")
        }
    }
}