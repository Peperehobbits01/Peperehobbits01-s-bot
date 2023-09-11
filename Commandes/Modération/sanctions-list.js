const Discord = require("discord.js")

module.exports = {

    name: "sanctions-list",
    description: "Affiche les sanctions d'un membre",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "🛡・Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre dont ont veux voir les sanctions",
            required: true,
            autocomplete: false
        }
    ],
    
    async run(bot, message, args, db) {

        let user = args.getUser("membre")
        if(!user) return message.reply("Aucun utilisateur sélectionnée!")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Aucun utilisateur sélectionnée!")

        await message.deferReply()

        db.query(`SELECT * FROM note WHERE guild = '${message.guildId}' AND user = '${user.id}'`, async (err, req) => {

            if(req.length < 1) console.log("Pas de note")
            await req.sort((a, b) => parseInt(b.date) - parseInt(a.date))

            let Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle(`Infractons de ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            .setFooter({text: "Infractions"})

            for(let i = 0; i < req.length; i++) {
    
                Embed.addFields([{name: `Note n°${i+1}`, value: `> **Auteur** : ${(await bot.users.fetch(req[i].author)).tag}\n> **ID** : \`${req[i].note}\`\n> **Raison** : \`${req[i].reason}\`\n> **Date** : <t:${Math.floor(parseInt(req[i].date) / 1000)}:f>`}])
            
            }

            db.query(`SELECT * FROM warn WHERE guild = '${message.guildId}' AND user = '${user.id}'`, async (err, req) => {

                if(req.length < 1) console.log("Pas de warn")
                await req.sort((a, b) => parseInt(b.date) - parseInt(a.date))
    
                for(let i = 0; i < req.length; i++) {
        
                    Embed.addFields([{name: `Warn n°${i+1}`, value: `> **Auteur** : ${(await bot.users.fetch(req[i].author)).tag}\n> **ID** : \`${req[i].warn}\`\n> **Raison** : \`${req[i].reason}\`\n> **Date** : <t:${Math.floor(parseInt(req[i].date) / 1000)}:f>`}])
                
                }
    
                db.query(`SELECT * FROM mute WHERE guild = '${message.guildId}' AND user = '${user.id}'`, async (err, req) => {
    
                    if(req.length < 1) console.log("Pas de mute")
                    await req.sort((a, b) => parseInt(b.date) - parseInt(a.date))
        
                    for(let i = 0; i < req.length; i++) {
        
                        Embed.addFields([{name: `Mute n°${i+1}`, value: `> **Auteur** : ${(await bot.users.fetch(req[i].author)).tag}\n> **ID** : \`${req[i].mute}\`\n> **Raison** : \`${req[i].reason}\`\n> **Temps** : ${req[i].time}\n> **Date** : <t:${Math.floor(parseInt(req[i].date) / 1000)}:f>`}])
                    
                    }

                    db.query(`SELECT * FROM kick WHERE guild = '${message.guildId}' AND user = '${user.id}'`, async (err, req) => {
    
                        if(req.length < 1) console.log("Pas de kick")
                        await req.sort((a, b) => parseInt(b.date) - parseInt(a.date))
            
                        for(let i = 0; i < req.length; i++) {
                           
                            Embed.addFields([{name: `Kick n°${i+1}`, value: `> **Auteur** : ${(await bot.users.fetch(req[i].author)).tag}\n> **ID** : \`${req[i].kick}\`\n> **Raison** : \`${req[i].reason}\`\n> **Date** : <t:${Math.floor(parseInt(req[i].date) / 1000)}:f>`}])
                        
                        } 
                        
                        db.query(`SELECT * FROM ban WHERE guild = '${message.guildId}' AND user = '${user.id}'`, async (err, req) => {
    
                            if(req.length < 1) console.log("Pas de ban")
                            await req.sort((a, b) => parseInt(b.date) - parseInt(a.date))
            
                            for(let i = 0; i < req.length; i++) {
                           
                                Embed.addFields([{name: `Ban n°${i+1}`, value: `> **Auteur** : ${(await bot.users.fetch(req[i].author)).tag}\n> **ID** : \`${req[i].ban}\`\n> **Raison** : \`${req[i].reason}\`\n> **Date** : <t:${Math.floor(parseInt(req[i].date) / 1000)}:f>`}])
                        
                            }
                    
                            await message.followUp({embeds: [Embed]})
                        })
                    })
                })
            })
        })
    }
}
