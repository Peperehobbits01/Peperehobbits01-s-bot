const Discord = require("discord.js");
const channelTypeName = (channelType) => {
    switch (channelType) {
        case Discord.ChannelType.GuildText:
            return "Salon textuel";

        case Discord.ChannelType.GuildVoice:
            return "Salon vocal";

        case Discord.ChannelType.GuildCategory:
            return "Catégorie";

        case Discord.ChannelType.GuildAnnouncement:
            return "Salon d'annonces";

        case Discord.ChannelType.AnnouncementThread:
            return "Fil d'annonce";

        case Discord.ChannelType.PublicThread:
            return "Fil public";

        case Discord.ChannelType.PrivateThread:
            return "Fil privé";

        case Discord.ChannelType.GuildStageVoice:
            return "Salon de conférence";

        case Discord.ChannelType.GuildForum:
            return "Forum";

        case Discord.ChannelType.GuildMedia:
            return "Salon média";

        case Discord.ChannelType.DM:
            return "Message privé";

        case Discord.ChannelType.GroupDM:
            return "Groupe privé";

        default:
            return `Type inconnu (${channelType})`;
    }
};

module.exports = { channelTypeName }