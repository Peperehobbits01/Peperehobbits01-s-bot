const Discord = require("discord.js")

module.exports = {
  name: "addlevel",
  description: "Donne des niveaux à un membre",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: false,
  category: "📊・Système d'expérience",
  options: [
    {
      type: "user",
      name: "membre",
      description: "Le membre à qui donner des niveaux.",
      required: true,
      autocomplete: false
    },
    {
      type: "number",
      name: "level",
      description: "Le montant des niveaux à donner.",
      required: true,
      autocomplete: false
    }
  ],

  async run(bot, message, args) {

    let db = bot.db;
    const member = args.getMember("membre")
    const level = args.getNumber("level")
    const dataXp = db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}' AND user = '${member.id}'`)

    if (!dataXp) {
        db.query(`INSERT INTO xp (guild, user, xp, level) VALUES ('${message.guildId}', '${member.id}', '0', '0')`)
        message.reply(`Je viens de l'ajouter à la base de données car il ne m'étais inconnue, veuillez réessayer !`)
    }

    if (dataXp) {
        db.query(`UPDATE xp SET level = '${level}' WHERE guild = '${message.guildId}' AND user = '${member.id}'`)
        message.reply({ content: `Tu as donné à ${member.user.tag} le nombre de level suivant: \`${level}\` !`, ephemeral: true });
    }
  }
};