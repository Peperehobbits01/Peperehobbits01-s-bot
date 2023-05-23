const Discord = require("discord.js")

module.exports = {
    name: "removelevel",
    description: "Retire des niveaux à un membre",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "📊・Système d'expérience",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à qui retirer des niveaux.",
            required: true,
            autocomplete: false
        },
        {
            type: "number",
            name: "level",
            description: "Le montant des niveaux à retirer.",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, interaction, args) {

        let db = bot.db;
        const member = args.getMember("membre")
        const level = args.getNumber("level")

        try {
            const dataXp = await Schema.findOne({ Guild: interaction.guild.id, User: member.id });

            if (!dataXp) return interaction.reply(`Le membre n'a pas d'xp/level !`)

            dataXp.Level = + parseInt(dataXp.Level) - parseInt(level);
            dataXp.XP = 0;
            dataXp.save();

            await interaction.reply({ content: `Tu as retiré à ${member.user.tag} le nombre de level suivant: \`${level}\` !`, ephemeral: true });
        } catch (err) {
            console.error(err);
            return interaction.reply("Erreur veuillez vérifiez et réessayez !")
        }
    }
};