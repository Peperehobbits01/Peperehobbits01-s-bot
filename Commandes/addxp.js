const Discord = require('discord.js')
const { EmbedBuilder } = require("discord.js")

module.exports = {
name: "addxp",
description: "Ajout d'expérience à un membre",  
permission: Discord.PermissionFlagsBits.Administrator,
dm: false,
category: "📊・Système d'expérience",
options: [
    {
      type: "number",
      name: "xp",
      description: "le nombre d'expérience a ajoutée",
      required: true,
      autocomplete: false
    },{
      type: "user",
      name: "membre",
      description: "le membre a qui doit être ajouter l'expérience",
      required: true,
      autocomplete: false,
    }
  ],

  async run(bot, message, args, db) {

    let user = args.getUser("membre")
    let xp = db.query(`SELECT level FROM xp WHERE guild = '${message.guild.id}' AND user = '${user.id}'`)
    let xptoadd = args.getNumber("xp")
    if(!xptoadd) return message.reply("le nombre d'expérience a ajoutée est vide ou invalide!")

    let xpadd = new EmbedBuilder()
          .setColor(bot.color)
          .setTitle("Expérience ajoutée")
          .setDescription(`\`${xptoadd} expérience\` on été ajoutée à ${user} par ${message.user}`)
          .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

    if((level + 1) * 1000 <= xp) {

      let xptoadd = args.getNumber("Expérience")

      db.query(`UPDATE xp SET xp = '${0 - ((level + 1) * 1000 <= xp)}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`)
      db.query(`UPDATE xp SET level = '${level + 1}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`)

      let channel = message.guild.channels.cache.get('931457930505629733');

      channel.send(`Tu l'as fais ${message.author}, tu arrives au niveau ${level + 1}. Bien jouée à toi!`)
  } else {

      let xptoadd = args.getNumber("Expérience")

      db.query(`UPDATE xp SET xp = '${xp + xptoadd}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`)

      message.reply({ embeds: [xpadd] })
    }
  }
}