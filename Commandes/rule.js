const Discord = require("discord.js")
const { EmbedBuilder, TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js")

module.exports = {
    name: 'rule',
    description: "Vous permez de créer un règlement.",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "📚・Informations",

    async run(bot, message, args) {

        const rule = new EmbedBuilder()
        .setTitle("Règlement")
        .setDescription(`1 ・ Les **Guidelines et Termes de Discord** sont à respecter.\n2・ Les **publicités** sur le **serveur et en message privée** de membre du serveur est **interdite**.\n3・ Les **débats** concernant tout type de **politique sont prohibés**.\n4・ Tout contenu **choquant, gore ou NSFW** est strictement **interdit**.\n5・ Ne **contestez** pas les **actions du staff en public**.\n6・ Aucune forme de **troll ou de spam** n'est autorisée, en **vocal comme à l'écrit**.\n7・ Nous vous demanderons d’utiliser **uniquement la langue française** dans l’**entièreté du serveur**.\nMerci de **réagir** avec le **bouton ci-dessous** pour **approuvée votre lecture du règlement**!\nPS: Le staff se réserve à la compréhension finale du règlement.`)
        .setColor(bot.color)
        .setTimestamp()
        .addFields()
        .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

        const rulebtn = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
        .setCustomId("rule")
        .setLabel("Accepter le réglement")
        .setStyle(Discord.ButtonStyle.Primary)
        .setEmoji("✅"))

        await message.channel.send({ embeds: [rule], components: [rulebtn] })
      }
}