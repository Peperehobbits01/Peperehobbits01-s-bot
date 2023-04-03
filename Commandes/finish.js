const Discord = require('discord.js');

module.exports = {
  name: "finish",
  description: "Permet de vérouiller un post.",
  category: "🛡・Modération",
  permission: "Aucune",
  dm: false,

  async run (bot, message) {
    if (message.channel.isThread()) {

      const thread = message.channel;
      const threadOwner = thread.ownerId;

      if (threadOwner !== message.user.id) {
        return await message.reply({content: 'Vous n\'êtes pas autorisé à fermer ce thread.', ephemeral: true});
      }

      await thread.setLocked(true);

      await message.reply('**Le post est maintenant verrouillé.**');
    } else {
     await message.reply({content: 'Cette commande ne peut être utilisée que dans un forum.', ephemeral: true});
    }
  }
};