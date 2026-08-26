const fs = require('fs')

module.exports = bot => {

	for (const file of fs.readdirSync('./src/Events').filter(f => f.endsWith(".js"))) {

		const event = require(`../Events/${file}`)
		bot.on(file.split(".js").join(""), event.bind(null, bot))
		console.log(`Evenement ${file} chargé avec succès!`)
	}
}
