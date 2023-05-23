const Discord = require("discord.js")

module.exports = {
    name: "clearlevel",
    description: "Effacer les niveaux d'un membre",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "📊・Système d'expérience",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à qui retirer tous ces niveaux.",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, interaction, args) {

        let db = bot.db;
        const member = args.getMember("membre")
        if(!member) return interaction.reply("Membre introuvable")

        try {
            const dataXp = await Schema.findOne({ Guild: interaction.guild.id, User: member.id });

            if (!dataXp) return interaction.reply(`Le membre n'a pas d'xp/level !`)

            dataXp.Level = 0;
            dataXp.XP = 0;
            dataXp.save();

            await interaction.reply({ content: `Tu as supprimer l'xp à ${member} !`, ephemeral: true });
        } catch (err) {
            console.error(err);
            return interaction.reply("Erreur veuillez vérifiez et réessayez !")
        }
    }
};