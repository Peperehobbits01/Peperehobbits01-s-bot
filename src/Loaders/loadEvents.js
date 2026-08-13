const fs = require('fs')

module.exports = async bot => {

	for (const file of fs.readdirSync('./src/Events').filter(ƒ => ƒ.endsWith(".js"))) {

		let event = require(`../Events/${file}`)
		bot.on(file.split(".js").join(""), event.bind(null, bot))
		console.log(`Evenement ${file} chargé avec succès!`)
	}
}
