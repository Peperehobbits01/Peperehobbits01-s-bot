const Discord = require("discord.js")
const { executeQuery } = require("../../Fonctions/databaseConnect")

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
    
    async run(bot, message, args) {

        let user = args.getUser("membre")
        if(!user) return message.reply("Aucun utilisateur sélectionnée!")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Aucun utilisateur sélectionnée!")

        await message.deferReply()

        const queryNoteSearch = `SELECT * FROM note WHERE guild = '${message.guildId}' AND user = '${user.id}'`
        const NoteResults = await executeQuery(queryNoteSearch)
        if(NoteResults.length < 1) console.log("Pas de note")
        await NoteResults.sort((a, b) => parseInt(b.date) - parseInt(a.date))

        let Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle(`Infractons de ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            .setFooter({text: "Infractions"})

        for(let i = 0; i < NoteResults.length; i++) {
    
            Embed.addFields([{name: `Note n°${i+1}`, value: `> **Auteur** : ${(await bot.users.fetch(NoteResults[i].author)).tag}\n> **ID** : \`${NoteResults[i].note}\`\n> **Raison** : \`${NoteResults[i].reason}\`\n> **Date** : <t:${Math.floor(parseInt(NoteResults[i].date) / 1000)}:f>`}])
            
        }

        const queryWarnSearch = `SELECT * FROM warn WHERE guild = '${message.guildId}' AND user = '${user.id}'`
        const WarnResults = await executeQuery(queryWarnSearch)

        if(WarnResults.length < 1) console.log("Pas de warn")
        await WarnResults.sort((a, b) => parseInt(b.date) - parseInt(a.date))
    
        for(let i = 0; i < WarnResults.length; i++) {
        
            Embed.addFields([{name: `Warn n°${i+1}`, value: `> **Auteur** : ${(await bot.users.fetch(WarnResults[i].author)).tag}\n> **ID** : \`${WarnResults[i].warn}\`\n> **Raison** : \`${WarnResults[i].reason}\`\n> **Date** : <t:${Math.floor(parseInt(WarnResults[i].date) / 1000)}:f>`}])
                
        }
    
        const queryMuteSearch = `SELECT * FROM mute WHERE guild = '${message.guildId}' AND user = '${user.id}'`
        const MuteResults = await executeQuery(queryMuteSearch)
    
        if(MuteResults.length < 1) console.log("Pas de mute")
        await MuteResults.sort((a, b) => parseInt(b.date) - parseInt(a.date))
        
        for(let i = 0; i < MuteResults.length; i++) {
        
            Embed.addFields([{name: `Mute n°${i+1}`, value: `> **Auteur** : ${(await bot.users.fetch(MuteResults[i].author)).tag}\n> **ID** : \`${MuteResults[i].mute}\`\n> **Raison** : \`${MuteResults[i].reason}\`\n> **Temps** : ${MuteResults[i].time}\n> **Date** : <t:${Math.floor(parseInt(MuteResults[i].date) / 1000)}:f>`}])
                    
        }

        const queryKickSearch = `SELECT * FROM kick WHERE guild = '${message.guildId}' AND user = '${user.id}'`
        const KickResults = await executeQuery(queryKickSearch)
    
        if(KickResults.length < 1) console.log("Pas de kick")
        await KickResults.sort((a, b) => parseInt(b.date) - parseInt(a.date))
            
        for(let i = 0; i < KickResults.length; i++) {
           
            Embed.addFields([{name: `Kick n°${i+1}`, value: `> **Auteur** : ${(await bot.users.fetch(KickResults[i].author)).tag}\n> **ID** : \`${KickResults[i].kick}\`\n> **Raison** : \`${KickResults[i].reason}\`\n> **Date** : <t:${Math.floor(parseInt(KickResults[i].date) / 1000)}:f>`}])
                        
        } 
                        
        const queryBanSearch = `SELECT * FROM ban WHERE guild = '${message.guildId}' AND user = '${user.id}'`
        const BanResults = await executeQuery(queryBanSearch)
    
        if(BanResults.length < 1) console.log("Pas de ban")
        await BanResults.sort((a, b) => parseInt(b.date) - parseInt(a.date))
            
        for(let i = 0; i < BanResults.length; i++) {
       
            Embed.addFields([{name: `Ban n°${i+1}`, value: `> **Auteur** : ${(await bot.users.fetch(BanResults[i].author)).tag}\n> **ID** : \`${BanResults[i].ban}\`\n> **Raison** : \`${BanResults[i].reason}\`\n> **Date** : <t:${Math.floor(parseInt(BanResults[i].date) / 1000)}:f>`}])
                        
        }
                    
        await message.followUp({embeds: [Embed]})
    }
}