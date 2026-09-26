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
	momRole: null,
	eventWinnerRole: null,
	youtubeChannelIds: [],
	youtubeAnnouncementChannel: null,
	youtubeNotifRole: null,
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
	momRole: {
		type: "snowflake",
		description: "Rôle spécial « Maman » (xp bonus).",
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
};

function  	getGuildConfigDefaults() {
	return {...DEFAULT_GUILD_CONFIG, youtubeChannelIds: []};
}

module.exports = {
	DEFAULT_GUILD_CONFIG,
	GUILD_CONFIG_SCHEMA,
	getGuildConfigDefaults,
};
