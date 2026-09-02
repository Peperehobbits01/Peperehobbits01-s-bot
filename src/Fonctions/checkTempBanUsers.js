const { executeQuery } = require("./databaseConnect.js");
const Discord = require("discord.js");

async function processExpiredBans(bot) {
	const now = Date.now();

	const rows = await executeQuery(
		`SELECT guild, user, ban, reason
         FROM ban
         WHERE time IS NOT NULL
           AND time <= ${now}`
	);

	if (!rows || rows.length === 0) return;

	for (const row of rows) {
		try {
			const guild = await bot.guilds.fetch(row.guild);
			await guild.bans.remove(row.user, `Bannissement temporaire expiré (ID: ${row.ban})`);

			await executeQuery(
				`UPDATE ban SET time = 'null' WHERE ban = '${row.ban}'`
			);

			try {
				const user = await bot.users.fetch(row.user);
				const embed = new Discord.EmbedBuilder()
					.setTitle("✅ Bannissement levé")
					.setDescription(`Votre bannissement temporaire sur **${guild.name}** a expiré. Vous pouvez revenir !`)
					.setColor(process.env.BOT_COLOR);
				await user.send({ embeds: [embed] });
			} catch {}

		} catch (err) {
			console.error(`[TempBan] Failed to unban ${row.user} in ${row.guild}:`, err);
		}
	}
}

module.exports = { processExpiredBans };
