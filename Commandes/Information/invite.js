const Discord = require('discord.js');

module.exports = {

    name: 'invite',
    description: `Permet de connaître le nombre de membre invité par un autre membre`,
    permission: "Aucune",
    category: "📚・Informations",
    options: [
        {   
            type: "user",
            name: 'membres',
            description: `Le membre dont vous voulez connaitre le nombre de membre inviter.`,
            required: true,
            autocomplete: false
        }
    ],
    
    run: async (bot, message, args) => {
      
        let user = args.getUser("membre")
        if(!user) return message.reply({content: "Aucun utilisateur sélectionné !"})
        
        let invites = await message.guild.invites.fetch();
        let userInv = invites.filter(u => u.inviter && u.inviter.id === user.id);

        let i = 0;
        userInv.forEach(inv => i += inv.uses);

        const invitations = new Discord.EmbedBuilder()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({
                name: user.tag,
                iconURL: user.displayAvatarURL({dynamic: true})
            })
            .setTitle("Nombre d'invitations de l'utilisateur")
            .setDescription(`${user.tag} a **${i}** invitations.`)
            .setFooter({
                text: "Gérée par l'instance de Peperehobbits01's Bot",
                iconURL: bot.user.displayAvatarURL({dynamic: true})
            });

        await message.reply({ embeds: [invitations]});
    }
}
