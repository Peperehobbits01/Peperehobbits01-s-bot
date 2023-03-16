const Discord = require("discord.js");
const ms = require("ms")
const voice = require("./voiceStateUpdate")

module.exports = async(bot, message) => {

    let db = bot.db;
    let user = voice

    if(user(channel.time === 60))
    db.query(`SELECT * FROM xp WHERE guild = '${channel.guildId}' AND user = '${user.id}'`, async (err, req) => {

        if(req.length < 1) {
            
            db.query(`INSERT INTO xp (guild, user, xp, level) VALUES (${channel.guildId}, '${user.id}', '0', '0')`)
        } else {

            let level = parseInt(req[0].level)
            let xp = parseInt(req[0].xp)

            if((level + 1) * 1000 <= xp) {

                db.query(`UPDATE xp SET xp = '${50}' WHERE guild = '${channel.guildId}' AND user = '${user.id}'`)
                db.query(`UPDATE xp SET level = '${level + 1}' WHERE guild = '${channel.guildId}' AND user = '${user.id}'`)

                let channel = message.guild.channels.cache.get('931457930505629733');
                channel.send(`Tu l'as fais ${user}, tu arrives au niveau ${level + 1}. Bien jouée à toi!`)
            } else {

                db.query(`UPDATE xp SET xp = '${xp + 50}' WHERE guild = '${channel.guildId}' AND user = '${user.id}'`)
            }
        }
    })
};
