const Discord = require("discord.js")

module.exports = {
    name: "clearxp",
    description: "Effacer l'expérience d'un membre",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "📊・Système d'expérience",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à qui effacer son expérience.",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, interaction, args) {

        let db = bot.db;
        const member = args.getMember("membre")

        try {
            const dataXp = await Schema.findOne({ Guild: interaction.guild.id, User: member.id });

            if (!dataXp) return interaction.reply(`Le membre n'a pas d'xp/level !`)

            dataXp.XP = 0;
            dataXp.save();

            await interaction.reply({ content: `Tu as supprimer l'xp à ${member} !`, ephemeral: true });
        } catch (err) {
            console.error(err);
            return interaction.reply("Erreur veuillez vérifiez et réessayez !")
        }
    }
};