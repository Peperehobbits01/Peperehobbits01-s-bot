const Discord = require("discord.js");

module.exports = async (bot) => {
	const now = Date.now();

	const rows = await bot.function.executeQuery(
		`SELECT guild, user, ban, reason
         FROM ban
         WHERE time IS NOT NULL
           AND time <= ${now}`, bot
	);

	if (!rows || rows.length === 0) return;

	for (const row of rows) {
		try {
			const guild = await bot.guilds.fetch(row.guild);
			await guild.bans.remove(row.user, `Bannissement temporaire expiré (ID: ${row.ban})`);

			await bot.function.executeQuery(
				`UPDATE ban SET time = 'null' WHERE ban = '${row.ban}'`, bot
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
			throw new Error(`Echecs du débanissement de ${row.user} dans ${row.guild}:`);
		}
	}
}
