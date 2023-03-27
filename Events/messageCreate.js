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

    const channelId = '1060534092321521694';
    const channel = await client.channels.fetch(channelId);

    if (channel.type === 'text') {

        const messages = await channel.messages.fetch({ limit: 2 });
        const lastMessage = messages.first();
        const previousMessage = messages.last();

        if (!isNaN(lastMessage.content) && !isNaN(previousMessage.content)) {
          const currentNumber = parseInt(lastMessage.content);
          const previousNumber = parseInt(previousMessage.content);
            if (currentNumber === previousNumber + 1) {}
            if (currentNumber !== previousNumber + 1) {
                console.log(`Le dernier message est un nombre (${currentNumber}) mais le message précédent n'est pas le nombre précédent plus 1.`);
                await lastMessage.delete();
              }
        }
    }
}