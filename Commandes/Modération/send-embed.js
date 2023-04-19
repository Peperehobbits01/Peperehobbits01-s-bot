const Discord = require("discord.js")
const { EmbedBuilder, TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js")
 
module.exports = {
 
  name: "send-embed",
  description: "💬 Envoyer un embed via moi",
  permission: Discord.PermissionFlagsBits.ManageMessages,
  dm: false,
  category: "🛡・Modération",
 
  async run(bot, message, args) {
 
    let Modal = new Discord.ModalBuilder()
        .setCustomId('send-Embed')
        .setTitle('Créé ton embed')

    let question1 = new Discord.TextInputBuilder()
        .setCustomId('couleur')
        .setLabel('Quelle couleur voulez-vous mettre ?')
        .setRequired(false)
        .setPlaceholder('Dans ce format : #3dffcc (facultatif)')
        .setStyle(TextInputStyle.Short)

    let question2 = new Discord.TextInputBuilder()
        .setCustomId('url')
        .setLabel('Quelle liens voulez-vous mettre ?')
        .setRequired(false)
        .setPlaceholder('Ecrit ici... (facultatif)')
        .setStyle(TextInputStyle.Short)

    let question3 = new Discord.TextInputBuilder()
        .setCustomId('titre')
        .setLabel('Quel titre voulez-vous mettre ?')
        .setRequired(true)
        .setPlaceholder('Ecrit ici...')
        .setStyle(TextInputStyle.Short)
 
    let question4 = new Discord.TextInputBuilder()
        .setCustomId('description')
        .setLabel("Quelle description voulez-vous mettre ?")
        .setRequired(true)
        .setPlaceholder('Ecrit ici...')
        .setStyle(TextInputStyle.Paragraph)

    let question5 = new Discord.TextInputBuilder()
        .setCustomId('fields')
        .setLabel("Quelle fields voulez-vous mettre ?")
        .setRequired(false)
        .setPlaceholder('Ecrit ici... (facultatif)')
        .setStyle(TextInputStyle.Paragraph)
 
    let ActionRow1 = new Discord.ActionRowBuilder().addComponents(question1);
    let ActionRow2 = new Discord.ActionRowBuilder().addComponents(question2);
    let ActionRow3 = new Discord.ActionRowBuilder().addComponents(question3);
    let ActionRow4 = new Discord.ActionRowBuilder().addComponents(question4);
    let ActionRow5 = new Discord.ActionRowBuilder().addComponents(question5);
 
    Modal.addComponents(ActionRow1, ActionRow2, ActionRow3, ActionRow4, ActionRow5)
 
    await message.showModal(Modal)

    let Modal1 = new Discord.ModalBuilder()
        .setCustomId('send-Embed1')
        .setTitle('Créé ton embed')

    let question6 = new Discord.TextInputBuilder()
        .setCustomId('author')
        .setLabel('Quelle footer voulez-vous mettre ?')
        .setRequired(false)
        .setPlaceholder('Ecrit ici... (facultatif)')
        .setStyle(TextInputStyle.Short)

    let question7 = new Discord.TextInputBuilder()
        .setCustomId('thumbnail')
        .setLabel("Quelle thumbnail voulez-vous mettre ?")
        .setRequired(false)
        .setPlaceholder('Ecrit ici... (facultatif)')
        .setStyle(TextInputStyle.Paragraph)

    let question8 = new Discord.TextInputBuilder()
        .setCustomId('footer')
        .setLabel('Quelle footer voulez-vous mettre ?')
        .setRequired(false)
        .setPlaceholder('Ecrit ici... (facultatif)')
        .setStyle(TextInputStyle.Short)

    let question9 = new Discord.TextInputBuilder()
        .setCustomId('Image')
        .setLabel("Quelle image voulez-vous mettre ?")
        .setRequired(false)
        .setPlaceholder('Ecrit ici... (facultatif)')
        .setStyle(TextInputStyle.Paragraph)

    let question10 = new Discord.TextInputBuilder()
        .setCustomId('video')
        .setLabel("Quelle vidéo voulez-vous mettre ?")
        .setRequired(false)
        .setPlaceholder('Ecrit ici... (facultatif)')
        .setStyle(TextInputStyle.Paragraph)

    let ActionRow6 = new Discord.ActionRowBuilder().addComponents(question6);
    let ActionRow7 = new Discord.ActionRowBuilder().addComponents(question7);
    let ActionRow8 = new Discord.ActionRowBuilder().addComponents(question8);
    let ActionRow9 = new Discord.ActionRowBuilder().addComponents(question9);
    let ActionRow10 = new Discord.ActionRowBuilder().addComponents(question10);

    Modal1.addComponents(ActionRow6, ActionRow7, ActionRow8, ActionRow9, ActionRow10)

    await message.showModal(Modal1)

    let Modal2 = new Discord.ModalBuilder()
        .setCustomId('send-Embed2')
        .setTitle('Créé ton embed')

    let question11 = new Discord.TextInputBuilder()
        .setCustomId('timestamp')
        .setLabel('Voulez-vous mettre le timestamp ?')
        .setRequired(false)
        .setPlaceholder('oui/non (facultatif)')
        .setStyle(TextInputStyle.Short)

    let ActionRow11 = new Discord.ActionRowBuilder().addComponents(question11);

    Modal2.addComponents(ActionRow11)

    await message.showModal(Modal2)
 
    try {
 
      let reponse = await message.awaitModalSubmit({time: 300000})

      let couleur = reponse.fields.getTextInputValue('couleur')
      let url = reponse.fields.getTextInputValue('url')
      let titre = reponse.fields.getTextInputValue('titre')
      let description = reponse.fields.getTextInputValue('description')
      let fields = reponse.fields.getTextInputValue('fields')
      let author = reponse.fields.getTextInputValue('author')
      let thumbnail = reponse.fields.getTextInputValue('thumbnail')
      let footer = reponse.fields.getTextInputValue('footer')
      let image = reponse.fields.getTextInputValue('image')
      let video = reponse.fields.getTextInputValue('video')
      let timestamp = reponse.fields.getTextInputValue('timestamp')
 
      const EmbedBuilder = new Discord.EmbedBuilder()
      .setColor('#3dffcc')
      .setDescription(`✅ Votre embed à été envoyer avec succès !`)
 
      if(!couleur) couleur = bot.color
      if(!url) url = ' '
      if(!titre) titre = ' '
      if(!description) description = ' '
      if(!fields) fields = ' '
      if(!author) author = ' '
      if(!thumbnail) thumbnail = ' '
      if(!footer) footer = ' '
      if(!image) image = ' '
      if(!video) video = ' '
      if(!timestamp) timestamp = ' '
 
      let EmbedBuilder1 = new Discord.EmbedBuilder()
        .setColor(`${couleur}`)
        .setUrl(`${url}`)
        .setTitle(`${titre}`)
        .setDescription(`${description}`)
        .setFields(`${fields}`)
        .setAuthor(`${author}`)
        .setThumbnail(`${thumbnail}`)
        .setFooter({ text: `${footer}` })
        .setImage(`${image}`)
        .setVideo(`${video}`)
        .setTimestamp()
 
      if(reponse.fields.getTextInputValue('timestamp') === 'oui') EmbedBuilder1.setTimestamp()
      if(!reponse.fields.getTextInputValue('timestamp') === 'oui') return;
 
      await message.channel.send({embeds: [EmbedBuilder1]})
 
      await reponse.reply({embeds: [EmbedBuilder], ephemeral: true})
 
    } catch (err) { return; }
  }
}