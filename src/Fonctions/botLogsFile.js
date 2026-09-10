const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const logsDir = path.join(__dirname, "../../logs");

fs.mkdirSync(logsDir, { recursive: true });

const runId = `${new Date().toISOString().replace(/[:.]/g, "-")}-${crypto
	.randomBytes(4)
	.toString("hex")}`;

const logFile = path.join(logsDir, `run-${runId}.log`);
const debugEnabled =
	process.env.DEBUG === "true" ||
	process.env.DEBUG === "1" ||
	process.env.NODE_ENV !== "production";

function formatError(error) {
	if (error instanceof Error) {
		return `${error.name}: ${error.message}\n${error.stack || ""}`;
	}

	return String(error);
}

const colors = {
	reset: "\x1b[0m",
	gray: "\x1b[90m",
	green: "\x1b[32m",
	orange: "\x1b[38;2;255;165;0m",
	red: "\x1b[31m",
};

const levelColors = {
	DEBUG: colors.gray,
	INFO: colors.green,
	WARN: colors.orange,
	ERROR: colors.red,
};

const useColors = Boolean(process.stdout.isTTY);

function colorize(level, text) {
	const color = levelColors[level] || colors.reset;
	return `${color}${text}${colors.reset}`;
}

function write(level, message, details) {
	if (level === "DEBUG" && !debugEnabled) {
		return;
	}

	const timestamp = new Date().toISOString();

	let formattedDetails = "";

	if (details !== undefined) {
		if (details instanceof Error) {
			formattedDetails = `\n${formatError(details)}`;
		} else if (typeof details === "object") {
			formattedDetails = ` ${JSON.stringify(details, null, 2)}`;
		} else {
			formattedDetails = ` ${details}`;
		}
	}

	const fileLine = `[${timestamp}] [${level}] ${message}${formattedDetails}\n`;
	const consoleColoredText = colorize(level, `[${level}]`);
	const consoleLine = `${consoleColoredText} ${message}${formattedDetails}\n`;

	if (level === "ERROR") {
		process.stderr.write(consoleLine);
	} else {
		process.stdout.write(consoleLine);
	}

	fs.appendFileSync(logFile, fileLine);
}

const botLogsFile = {
	runId,
	logFile,

	/*debug(message, details) {
		write("DEBUG", message, details);
	}, This is planned for later.*/

	info(message, details) {
		write("INFO", message, details);
	},

	warn(message, details) {
		write("WARN", message, details);
	},

	error(message, details) {
		write("ERROR", message, details);
	},
};

module.exports = botLogsFile;
