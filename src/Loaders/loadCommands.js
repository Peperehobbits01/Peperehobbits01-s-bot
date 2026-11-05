const {opendir} = require('node:fs/promises');
const {join: pathJoin} = require('node:path');
const pathModule = require('node:path');
const {Collection} = require('discord.js');

/**
 * Log commands as individual INFO messages
 *
 * @param {(string|object)[]} array
 * @param bot
 */
function logDirectoryTree(array, bot) {
	bot.function.botLogsFile.info("Chargement des commandes en cours...");

	logCommandEntries(array, bot);
}

/**
 * Recursively log command entries without repeating the loading message
 *
 * @param {(string|object)[]} array
 * @param bot
 */
function logCommandEntries(array, bot) {
	for (const element of array) {
		if (typeof element === "object" && element !== null) {
			bot.function.botLogsFile.info(`${element.name} (${element.sub.length})`);

			logCommandEntries(element.sub, bot);
		} else if (typeof element === "string") {
			bot.function.botLogsFile.info(element);
		} else {
			throw new Error("Invalid element type");
		}
	}
}

/**
 * Build a directory tree from a path
 * @param {string} path
 * @returns {Promise<(string|object)[]>}
 */
async function buildDirectoryTree(path) {
	const result = [];
	const dir = await opendir(path);
	const dirents = [];
	for await (const dirent of dir) {
		dirents.push(dirent);
	}

	dirents.sort((a, b) => a.name.localeCompare(b.name));
	for (const dirent of dirents) {
		if (dirent.isDirectory()) {
			result.push({name: dirent.name, sub: await buildDirectoryTree(pathJoin(path, dirent.name))});
		} else if (dirent.isFile() && pathModule.extname(dirent.name) === '.js') {
			result.push(dirent.name);
		}
	}
	return result;
}

/**
 * Build paths from a directory tree
 * @param {string} basePath
 * @param {(string|object)[]} directoryTree
 * @returns {string[]}
 */
function buildPaths(basePath, directoryTree) {
	const paths = [];
	for (const elt of directoryTree) {
		switch (typeof elt) {
			case "object":
				for (const subElt of buildPaths(elt.name, elt.sub)) {
					paths.push(pathJoin(basePath, subElt));
				}
				break;
			case "string":
				paths.push(pathJoin(basePath, elt));
				break;
			default:
				throw new Error('Invalid element type');
		}
	}
	return paths;
}

/**
 * Load command modules from the project's command directory
 * @param bot
 * @returns {Promise<void>}
 */
async function loadCommands(bot) {
	const commandDirectory = pathModule.resolve(__dirname, "../Commandes");
	const directoryTree = await buildDirectoryTree(commandDirectory);
	const paths = buildPaths(commandDirectory, directoryTree);
	if (!bot.commands) bot.commands = new Collection();
	for (const commandPath of paths) {
		const command = require(commandPath);
		if (!command || typeof command !== "object" || typeof command.name !== "string" || command.name.trim() === "") {
			throw new TypeError(`La commande ${commandPath} doit exporter un objet avec un nom non vide.`);
		}
		if (typeof command.run !== "function") {
			throw new TypeError(`La commande "${command.name}" (${commandPath}) doit exporter une fonction run.`);
		}
		if (bot.commands.has(command.name)) {
			throw new Error(`Le nom de commande "${command.name}" est déjà utilisé (${commandPath}).`);
		}
		bot.commands.set(command.name, command);
	}
	logDirectoryTree(directoryTree, bot);
}

module.exports = loadCommands;
