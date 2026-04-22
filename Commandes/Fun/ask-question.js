const Discord = require('discord.js')
const { EmbedBuilder } = require('discord.js');
const answers = [
  'Il est certain.',
  'C\'est décidément ainsi.',
  'Sans aucun doute.',
  'Oui définitivement.',
  'Vous pouvez vous y fier.',
  'Comme je le vois oui.',
  'Bonne perspective.',
  'Oui.',
  'Non.',
  'Les signes pointent vers Oui.',
  'Je sais pas.',
  'Répondre brumeuse, réessayer.',
  'Demander à nouveau plus tard.',
  'Mieux vaut ne pas te dire maintenant.',
  'Impossible de prédire maintenant.',
  'Concentrez-vous et demandez à nouveau.',
  'Ne comptez pas dessus.',
  'Ma réponse est non.',
  'Mes sources disent non.',
  'Les perspectives ne sont pas si bonnes.',
  'Très douteux.',
  'Je crois que je dois créser plus la question.'
];

module.exports = {
 
  name: "ask-question",
  description: "Je répond a tes question",
  permission: "Aucune",
  dm: false,
  category: "🥳・Fun",
  options: [
    {
        type: "string",
        name: "question",
        description: "Pose ta question",
        required: true,
        autocomplete: false
    },
    
],
  async run(bot, message, args) {
    
     let msg = args.getString("question")
     
    const Ask = new Discord.EmbedBuilder()
      .setTitle('🎱  Je réponds à tes questions  🎱')
      .setDescription(`
Question de ${message.user} \`\`\`${msg}\`\`\`
Réponse : \`\`\`${answers[Math.floor(Math.random() * answers.length)]}\`\`\`

`)
      .setTimestamp()
      .setFooter({ text: bot.user.username, iconURL: bot.user.avatarURL({ dynamic: true }) })
      .setColor(process.env.BOT_COLOR);

      await message.reply({embeds: [Ask]})
  }
};