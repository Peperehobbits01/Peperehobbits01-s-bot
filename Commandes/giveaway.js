const Discord = require("discord.js");
const ms = require('ms');

module.exports = {
  name: 'giveaway',
  description: 'Lancer un giveaway',
  permission : Discord.PermissionFlagsBits.Administrator,
  dm: false,
  category: "🎁・giveaway",
  options: [
    {
      name: 'duration',
      type: 'string',
      description: 'La duration du giveaway',
      required: true,
      autocomplete: false
    },
    {
      name: 'winners',
      type: 'integer',
      description: 'Le nombre de gagnant',
      required: true,
      autocomplete: false
    },
    {
      name: 'prize',
      type: 'string',
      description: 'Le prix du giveaway',
      required: true,
      autocomplete: false
    },
  ],
  async run(bot, interaction, args) {
    let duration = args.getString('duration');
    let winners = args.getInteger('winners');
    let prize = args.getString('prize');

    // Calculer le temps restant
  let durationMs = ms(duration);
  let endTime = Date.now() + durationMs;

    const offrir = new Discord.EmbedBuilder()
      .setColor(bot.color)
      .setTitle(`Giveaway: ${prize}`)
      .setDescription(`Réagissez avec 🎉 pour participer !\Duration: **${duration}**\nNombre de gagnant: **${winners}**`)
      .setTimestamp(endTime);

    const message = await interaction.reply({ embeds: [offrir], fetchReply: true });
    await message.react('🎉');

    const updateInterval = setInterval(() => {
      const timeLeftMs = endTime - Date.now();
      if (timeLeftMs <= 0) {
        clearInterval(updateInterval);
        //embed.setDescription(`Le giveaway est terminé !\nGG ! Tu as 24h pour venir en ticket sinon reroll !`);
        //message.edit({ embeds: [embed] });
        return;
      }
      embed.setDescription(`Réagissez avec 🎉 pour participer !\nduration: **${duration}**\nNombre de winners: **${winners}**\nTemps restant: **${ms(timeLeftMs, { long: true })}**`);
      message.edit({ embeds: [embed] });
    }, 20000 && 25000)

    setTimeout(async () => {
      const fetchedMessage = await interaction.channel.messages.fetch(message.id);
      const reactions = fetchedMessage.reactions.cache.get('🎉').users.cache.filter((user) => !user.bot);
      if (reactions.size < winners) {
        const failedEmbed = new Discord.EmbedBuilder()
          .setColor('#ff0000')
          .setTitle(`Giveaway: ${prize}`)
          .setDescription(`Il n'y a pas assez de participants pour déterminer les winners`);

        return message.edit({ embeds: [failedEmbed] });
      }

      const gagnants = reactions.random(winners);
      const winnersList = gagnants.map((user) => `<@${user.id}>`).join(', ');

      const successEmbed = new Discord.EmbedBuilder()
        .setColor('#36ff00')
        .setTitle(`Giveaway: ${prize}`)
        .setDescription(`Félicitations ${winnersList} ! Vous avez gagné **${prize}** !`);


      return message.edit({ embeds: [successEmbed] });
    }, ms(duration));
  },
};
