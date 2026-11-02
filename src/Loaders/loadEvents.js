const fs = require('node:fs');
const path = require('node:path');

module.exports = (bot) => {
	const eventsDirectory = path.join(__dirname, "../Events");
	const eventFiles = fs.readdirSync(eventsDirectory)
		.filter((file) => file.endsWith(".js"))
		.sort();

	for (const file of eventFiles) {
		const eventName = path.basename(file, ".js");
		const event = require(path.join(eventsDirectory, file));

		if (typeof event !== "function") {
			throw new TypeError(`L'événement ${file} doit exporter une fonction.`);
		}

		bot.on(eventName, event.bind(null, bot));
		bot.function.botLogsFile.info(`Evenement ${file} chargé avec succès!`);
	}
};
