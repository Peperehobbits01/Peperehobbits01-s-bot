const {opendir} = require('node:fs/promises');
const {join: pathJoin} = require('node:path');
const {Collection, Bot} = require('discord.js');

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
	for await (const dirent of dir) {
		if (dirent.isDirectory()) {
			result.push({name: dirent.name, sub: await buildDirectoryTree(pathJoin(path, dirent.name))});
		} else {
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
 * Load commands from a path
 * @param bot
 * @param {string} path
 * @returns {Promise<void>}
 */
async function loadCommands(bot, path) {
	const directoryTree = await buildDirectoryTree(path);
	const paths = buildPaths(path, directoryTree);
	if (!bot.commands) bot.commands = new Collection();
	for (const path of paths) {
		const command = require(path);
		bot.commands.set(command.name, command);
	}
	logDirectoryTree(directoryTree, bot);
}

module.exports = loadCommands;
