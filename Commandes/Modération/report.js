const Discord = require("discord.js")

module.exports = {

  name: "report",
  description: "💬 Envois un message de report à l'équipe.",
  permission: "Aucune",
  category: "🛡・Modération",

  async run(bot, message) {

      let question1 = new Discord.TextInputBuilder({
          customId: 'sayreport',
          label: 'Que souhaitez-vous signalée ?',
          required: true,
          placeholder: 'Indiquez votre signalement ici',
          style: Discord.TextInputStyle.Paragrapht
      })

      let ActionRow1 = new Discord.ActionRowBuilder().addComponents(question1);

      let Modal = new Discord.ModalBuilder({
          customId: 'report',
          title: "Signaler un problème.",
          components: [ActionRow1]
      })

    await message.showModal(Modal)

    try {

      let reponse = await message.awaitModalSubmit({time: 300000})

      let whatToReport = reponse.fields.getTextInputValue('sayreport')

      const EmbedReport = new Discord.EmbedBuilder()
          .setColor(process.env.BOT_COLOR)
          .setTitle(`Votre report a bien été reçu.`)
          .setDescription("Merci d'avoir effectuer votre rapport. Nous regarderons à celui-ci dès que possible !")
          .setFooter({
            text: "Gérée par l'instance de Peperehobbits01's Bot",
            iconURL: bot.user.displayAvatarURL({dynamic: true})
          })

      let channel = message.guild.channels.cache.get(process.env.REPORT_CHANNEL);

      const EmbedwhatToReport = new Discord.EmbedBuilder()
          .setColor(process.env.BOT_COLOR)
          .setTitle(`Report effectuer par __${message.user.tag}__`)
          .setDescription(`${whatToReport}`)
          .setFooter({
            text: `${message.user.displayName}・ID : ${message.user.id}`,
            iconURL: message.user.displayAvatarURL({dynamic: true})
          })

      await channel.send({embeds: [EmbedwhatToReport]});

      await reponse.reply({embeds: [EmbedReport], flags: [Discord.MessageFlags.Ephemeral]})

    } catch (err) {}
  }
}