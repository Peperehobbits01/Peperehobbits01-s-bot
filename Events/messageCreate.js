const Discord = require("discord.js")

module.exports = async(bot, message) => {

    let db = bot.db;
    if(message.author.bot || message.channel.type === Discord.ChannelType.DM) return;

    db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`, async (err, req) => {

        if(req.length < 1) {
            
            db.query(`INSERT INTO xp (guild, user, xp, level) VALUES (${message.guildId}, '${message.author.id}', '0', '0')`)
        } else {

            let level = parseInt(req[0].level)
            let xp = parseInt(req[0].xp)

            if((level + 1) * 1000 <= xp) {

                let xptogive = Math.floor(Math.random() * 30) + 15;

                db.query(`UPDATE xp SET xp = '${0 - ((level + 1) * 1000 <= xp)}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`)
                db.query(`UPDATE xp SET level = '${level + 1}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`)

                let channel = message.guild.channels.cache.get('931457930505629733');
                channel.send(`Tu l'as fais ${message.author}, tu arrives au niveau ${level + 1}. Bien jouée à toi!`)
            } else {

                let xptogive = Math.floor(Math.random() * 30) + 15;

                db.query(`UPDATE xp SET xp = '${xp + xptogive}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`)
            }
        }
    })

    if(message.channel.type === Discord.ChannelType.DM) {
        if (message.author.bot) {
          return;
        }    
        const channel = bot.channels.cache.get("931457930505629733");
        if (!channel) return;
    
        const EmbedMP = new EmbedBuilder()
          .setColor(bot.color)
          .setTitle("Nouveau DM")
          .setDescription(`Auteur du message : ${message.author}\nDate de création du message : <t:${Math.floor(message.createdAt / 1000)}:F>\nContenu : \`\`\`${message.content}\`\`\``)
          .setTimestamp();
        
        channel.send({ embeds: [EmbedMP] });
      }
}