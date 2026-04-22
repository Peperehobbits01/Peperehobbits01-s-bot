const Discord = require("discord.js")
const { executeQuery } = require ("../../Fonctions/databaseConnect.js")

module.exports = {
  name: 'removexp',
  description: "Retirer de l'expérience a un membre",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: false,
  category: "📊・Système d'expérience",
  options: [
    {
      type: "number",
      name: "xp",
      description: "Le nombre d'expérience à retirée",
      required: true,
      autocomplete: true,
    },
    {
      type: "user",
      name: "membre",
      description: "le membre a qui doit être retirer l'expérience",
      required: true,
      autocomplete: true,
    }
  ],
  async run(bot, message, args, db) {

    let user = args.getUser("membre")

    db.query(`SELECT * FROM xp WHERE guild = '${message.guild.id}' AND user = '${user.id}'`, async (err, req) => {
      let level = req[0].level
      let xptoremove = args.getNumber("xp")

      if (level <= 0) {
        db.query(`UPDATE xp SET level = '0' WHERE guild = '${message.guild.id}' AND user = '${user.id}'`)
        db.query(`UPDATE xp SET xp = '0' WHERE guild = '${message.guild.id}' AND user = '${user.id}'`)

        let xpRemoveError = new Discord.EmbedBuilder()
          .setColor(bot.color)
          .setTitle("Niveau retirer")
          .setDescription(`Aucun niveau on été retirer à ${user}, car il est déjà niveau 0`)
          .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

        message.reply({ embeds: [xpRemoveError] })
      } else {
        db.query(`UPDATE xp SET xp = '${xp - xptoremove}' WHERE guild = '${message.guild.id}' AND user = '${user.id}' `)
        let xpleavetoremove = xp
        if(xp < 0)
        if((level - 1) * 1000 <= xp)
        db.query(`UPDATE xp SET level = '${level - 1}' WHERE guild = '${message.guild.id}' AND user = '${user.id}' `)
        db.query(`UPDATE xp SET xp = '${level * 1000 - xpleavetoremove}' WHERE guild = '${message.guild.id}' AND user = '${user.id}' `)
        if(xp < 0);

        let xpRemove = new Discord.EmbedBuilder()
          .setColor(bot.color)
          .setTitle("Niveau retirer")
          .setDescription(`\`${xptoremove} niveaux\` on été retirer à ${user} par ${message.user}`)
          .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

        message.reply({ embeds: [xpRemove] })
      }
    })
  }
}