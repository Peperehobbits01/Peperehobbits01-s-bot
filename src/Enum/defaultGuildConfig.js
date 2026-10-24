const DEFAULT_GUILD_CONFIG = {
	welcomeChannel: null,
	levelPassChannel: null,
	countingChannel: null,
	reportChannel: null,
	logsChannelMember: null,
	logsChannelVoice: null,
	logsChannelChannel: null,
	logsChannelGuild: null,
	logsChannelSanctions: null,
	logsChannelMessage: null,
	logsChannelGateway: null,
	boosterChannel: null,
	boosterRole: null,
	mdmRole: null,
	eventWinnerRole: null,
	youtubeChannelIds: [],
	youtubeAnnouncementChannel: null,
	youtubeNotifRole: null,
	twitchChannelUsernames: [],
	twitchAnnouncementChannel: null,
	twitchNotifRole: null,
};

const GUILD_CONFIG_SCHEMA = {
	welcomeChannel: {
		type: "snowflake",
		description: "Salon dans lequel le bot envoie le message de bienvenue.",
		nullable: true,
	},
	levelPassChannel: {
		type: "snowflake",
		description: "Salon de notification lors du passage de niveau.",
		nullable: true,
	},
	countingChannel: {
		type: "snowflake",
		description: "Salon du jeu de compte (nombre, etc.).",
		nullable: true,
	},
	reportChannel: {
		type: "snowflake",
		description: "Salon qui reçoit les signalements.",
		nullable: true,
	},
	logsChannelMember: {
		type: "snowflake",
		description: "Salon des journaux de changements de membre / rôles.",
		nullable: true,
	},
	logsChannelVoice: {
		type: "snowflake",
		description: "Salon des journaux de changements de vocal.",
		nullable: true,
	},
	logsChannelChannel: {
		type: "snowflake",
		description: "Salon des journaux de création / suppression / modification de salon.",
		nullable: true,
	},
	logsChannelGuild: {
		type: "snowflake",
		description: "Salon des journaux généraux du serveur.",
		nullable: true,
	},
	logsChannelSanctions: {
		type: "snowflake",
		description: "Salon des journaux de sanctions (ban, kick).",
		nullable: true,
	},
	logsChannelMessage: {
		type: "snowflake",
		description: "Salon des journaux de suppression / édition de message.",
		nullable: true,
	},
	logsChannelGateway: {
		type: "snowflake",
		description: "Salon des journaux d'arrivée / départ de membre.",
		nullable: true,
	},
	boosterChannel: {
		type: "snowflake",
		description: "Salon de remerciement lors d'un boost.",
		nullable: true,
	},
	boosterRole: {
		type: "snowflake",
		description: "Rôle des boosteurs (xp bonus).",
		nullable: true,
	},
	mdmRole: {
		type: "snowflake",
		description: "Rôle spécial de membres du mois (xp bonus).",
		nullable: true,
	},
	eventWinnerRole: {
		type: "snowflake",
		description: "Rôle des gagnants d'événement (xp bonus).",
		nullable: true,
	},
	youtubeChannelIds: {
		type: "list",
		description: "Liste des ID de chaînes YouTube à surveiller (séparés par des virgules).",
		itemPattern: /^UC[a-zA-Z0-9_-]{22}$/,
		itemDescription: "Un ID de chaîne YouTube au format UC suivi de 22 caractères",
		nullable: true,
	},
	youtubeAnnouncementChannel: {
		type: "snowflake",
		description: "Salon de publication des nouvelles vidéos YouTube.",
		nullable: true,
	},
	youtubeNotifRole: {
		type: "snowflake",
		description: "Rôle à mentionner lors d'une nouvelle vidéo YouTube.",
		nullable: true,
	},
	twitchChannelUsernames: {
		type: "list",
		description: "Liste des noms d'utilisateur Twitch à surveiller (séparés par des virgules).",
		itemPattern: /^[a-z0-9_]{1,25}$/i,
		itemDescription: "Un nom d'utilisateur Twitch de 1 à 25 lettres, chiffres ou underscores",
		lowercase: true,
		nullable: true,
	},
	twitchAnnouncementChannel: {
		type: "snowflake",
		description: "Salon de publication lors du commencement d'un direct sur Twitch.",
		nullable: true,
	},
	twitchNotifRole: {
		type: "snowflake",
		description: "Rôle à mentionner lors du commencement d'un direct sur Twitch.",
		nullable: true,
	},
};

module.exports = {
	DEFAULT_GUILD_CONFIG,
	GUILD_CONFIG_SCHEMA,
};
