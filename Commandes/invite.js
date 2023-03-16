const Discord = require('discord.js');

module.exports = {

    name: 'invite',
    description: `Voir combien d'invitations les membres ont déjà envoyées`,
    permission: "Aucune",
    category: "📚・Informations",
    dm: false,
    options: [
        {   
            type: "user",
            name: 'membres',
            description: `L'utilisateur dont vous voulez vérifier les invitations.`,
            required: true,
            autocomplete: false
        }
    
    ],
    
    run: async (bot, interaction, message) => {
      
        const user = interaction.options.getUser('membres');
        
        let invites = await interaction.guild.invites.fetch();
        let userInv = invites.filter(u => u.inviter && u.inviter.id === user.id);

        let i = 0;
        userInv.forEach(inv => i += inv.uses);

        const embed = new Discord.EmbedBuilder()
            .setColor(0x2f3136)
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setTitle("Nombre d'invitations d'utilisateurs")
            .setDescription(`${user.tag} a **${i}** invitations.`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
}