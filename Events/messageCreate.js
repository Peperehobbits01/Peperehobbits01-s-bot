const Discord = require("discord.js")
const { executeQuery } = require("../Fonctions/databaseConnect.js")

module.exports = async(bot, message) => {

    if(message.author.bot || message.channel.type === Discord.ChannelType.DM) return;

    const querySearch = `SELECT * FROM xp WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`  
    const results = await executeQuery(querySearch)

    if(results.length < 1) {
            
            const queryAdd = `INSERT INTO xp (guild, user, xp, level) VALUES (${message.guildId}, '${message.author.id}', '0', '0')`
            await executeQuery(queryAdd)

        } else {

            let level = parseInt(results[0].level)
            let xp = parseInt(results[0].xp)

            if((level + 1) * 1000 <= xp) {

                let xptogive = Math.floor(Math.random() * 30) + 15;
                const queryXpupdate = `UPDATE xp SET xp = '${0 - ((level + 1) * 1000 <= xp)}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`
                const queryLevelUpdate = `UPDATE xp SET level = '${level + 1}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`

                await executeQuery(queryLevelUpdate, queryXpupdate)

                let channel = message.guild.channels.cache.get('931457930505629733');
                channel.send(`Tu l'as fais ${message.author}, tu arrives au niveau ${level + 1}. Bien jouée à toi!`)
            } else {

                let xptogive = Math.floor(Math.random() * 30) + 15;
                const queryXpUpdate = `UPDATE xp SET xp = '${xp + xptogive}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`
                await executeQuery(queryXpUpdate)
        }
    }

//    const channel = bot.channels.fetch('1060534092321521694');
//    const messages = await channel.messages.fetch({ limit: 2 });
//    const lastMessage = messages.first();
//    const previousMessage = messages.last();

//    if (!isNaN(lastMessage.content) && !isNaN(previousMessage.content)) {
//        const currentNumber = parseInt(lastMessage.content);
//        const previousNumber = parseInt(previousMessage.content);
//    if (currentNumber === previousNumber + 1) {
//        } else {
//            if (currentNumber !== previousNumber + 1) {
//                await lastMessage.delete();
//            }
//        }
//    }
}