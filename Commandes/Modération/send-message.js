const Discord = require("discord.js")
 
module.exports = {
 
  name: "send-message",
  description: "💬 Envois un message via moi.",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: false,
  category: "🛡・Modération",
 
  async run(bot, message, args) {
 
    let Modal = new Discord.ModalBuilder()
    .setCustomId('reporte')
    .setTitle('Message que je dit')
 
    let question1 = new Discord.TextInputBuilder()
    .setCustomId('saychat')
    .setLabel("Que dois-je dire ?!")
    .setRequired(true)
    .setPlaceholder('Indiquez la description ici')
    .setStyle(Discord.TextInputStyle.Paragraph)
  
    let ActionRow1 = new Discord.ActionRowBuilder().addComponents(question1);
 
    Modal.addComponents(ActionRow1)
 
    await message.showModal(Modal)
 
    try {

      let reponse = await message.awaitModalSubmit({time: 300000})

      let whatToSay = reponse.fields.getTextInputValue('saychat')
  
      const EmbedSay = new Discord.EmbedBuilder()
      .setColor('#2ca117')
      .setDescription(`**Votre texte s'est envoyé correctement.**`)

      await message.channel.send({ content: whatToSay });
   
      await reponse.reply({embeds: [EmbedSay], ephemeral: true})

    } catch (err) { return; }
  }
}