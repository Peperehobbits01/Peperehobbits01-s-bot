const fs = require("fs")

module.exports = async bot => {

    fs.readdirSync('./Button').filter(ƒ => ƒ.endsWith(".js")).forEach(async file =>{

        let Button = require(`../Button/${file}`)
        bot.on(file.split(".js").join(""), Button.bind(null, bot))
        console.log(`Boutton ${file} chargé avec succès!`)
    })
}