const fs = require('fs')

module.exports = async bot => {

    fs.readdirSync('./Events').filter(ƒ => ƒ.endsWith(".js")).forEach(async file =>{

        let event = require(`../Events/${file}`)
        bot.on(file.split(".js").join(""), event.bind(null, bot))
        console.log(`Evenement ${file} chargé avec succès!`)
    })
}