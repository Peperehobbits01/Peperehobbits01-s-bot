const Discord = require('discord.js')
const discord_giveaway = require("discord-giveaway-easy")

module.exports = {
   
  name: "giveaway",
  description: "Lance un giveaway",
  permission: Discord.PermissionFlagsBits.ManageMessages,
  dm: true,
  category: "🎁・Concours",
  options: [
    {
      type: "string",
      name: "titre",
      description: "Le titre du giveaway",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "time",
      description: "Le temps du giveaway",
      required: true,
      autocomplete: false,
    },
    {
      type: "number",
      name: "winner_number",
      description: "Le nombre de winners du giveaway",
      required: true,
      autocomplete: false,
    }
  ],

  async run(bot, message, args) {

    let title = args.getString("titre")
    let time = args.getString("time")
    let winnerNumber = args.getNumber("winner_number")

    let manager = new discord_giveaway.giveawaysManager(bot, {
      embedColor: (bot.color),
      buttonEmoji: "🎉"
    })
    

    manager.start(message.channel, {
      time: time,
      prize: title,
      winnerNumber: winnerNumber,
      interaction: message,
      buttonType: Discord.ButtonStyle.Primary,
    })

  
  }


}