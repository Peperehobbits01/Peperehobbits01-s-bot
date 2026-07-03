const Discord = require("discord.js")

module.exports = {

  //TODO Fix the report commands modal deprecation issue.
  name: "report",
  description: "💬 Envois un message de report à l'équipe.",
  permission: "Aucune",
  dm: false,
  category: "🛡・Modération",

  async run(bot, message, args) {

    let Modal = new Discord.ModalBuilder()
    .setCustomId('report')
    .setTitle('La chose que je signale')

    let question1 = new Discord.TextInputBuilder()
    .setCustomId('sayreport')
    .setLabel({label: "Que dois-je signalée ?!"})
    .setRequired(true)
    .setPlaceholder('Indiquez la description ici')
    .setStyle(Discord.TextInputStyle.Paragraph)

    let ActionRow1 = new Discord.ActionRowBuilder().addComponents(question1);

    Modal.addComponents([ActionRow1])

    await message.showModal(Modal)

    try {

      let reponse = await message.awaitModalSubmit({time: 300000})

      let whatToReport = reponse.fields.getTextInputValue('sayreport')

      const EmbedReport = new Discord.EmbedBuilder()
      .setColor(process.env.BOT_COLOR)
      .setDescription(`**Votre report s'est envoyé correctement.**`)

      let channel = message.guild.channels.cache.get('1073882868733972502');

      const EmbedwhatToReport = new Discord.EmbedBuilder()
      .setColor(process.env.BOT_COLOR)
      .setTitle("Report sur le serveur")
      .setDescription(`${whatToReport}`)
      .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

      await channel.send({embeds: [EmbedwhatToReport]});

      await reponse.reply({embeds: [EmbedReport]}, {ephemeral: true})

    } catch (err) { return; }
  }
}