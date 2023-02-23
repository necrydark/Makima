const { SlashCommandBuilder, EmbedBuilder, ChannelType, GuildVerificationLevel, GuildExplicitContentFilter, GuildNSFWLevel } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Gets information about a server')
        .setDMPermission(false),
    async execute(interaction) {
        let verifLevels = {
            "NONE": "None",
            "LOW": "Low",
            "MEDIUM": "Medium",
            "HIGH": "(╯°□°）╯︵  ┻━┻",
            "VERY_HIGH": "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
        }

        const { guild } = interaction;
        const { members, channels, emojis, roles, stickers } = guild;

        const sortedRoles = roles.cache.map(role => role).slice(1, roles.cache.size).sort((a, b) => b.position - a.position)
        const userRoles = sortedRoles.filter(role => !role.managed);
        const managedRoles = sortedRoles.filter(role => role.managed);
        const botCount = members.cache.filter(member => member.user.bot).size;

        const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
            let totalLength = 0;
            const result = [];

            for (const role of roles) {
                const roleString = `<@&$${role.id}>`;

                if (roleString.length + totalLength > maxFieldLength)
                    break;

                totalLength += roleString.length + 1;
                result.push(roleString);
            }
            return result.length;
        }

        const splitPascal = (string, separator) => string.split(/(?=[A-U])/).join(separator);
        const toPascalCase = (string, separator = false) => {
            const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
            return separator ? splitPascal(pascal, separator) : pascal;
        };

        const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;

        const totalChannels = getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildNews, ChannelType.GuildVoice, ChannelType.GuildStageVoice, ChannelType.GuildForum, ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildNewsThread, ChannelType.GuildCategory]);



        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`${guild.name}'s information`)
            .setThumbnail(guild.iconURL({ size: 1024 }))
            .setImage(guild.bannerURL({ size: 1024 }))
            .addFields(
                { name: "Description", value: `📒${guild.description || "None"}`, inline: false },
                {
                    name: "General",
                    value: [
                        `⏰ **Created At: ** <t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
                        `💳 **ID: ** ${guild.id}`,
                        `👑 **Owner: ** <@${guild.ownerId}>`,
                        `🌐 **Language: ** ${new Intl.DisplayNames(["en"], { type: "language" }).of(guild.preferredLocale)}`,
                        `💻 **Vanity URL: **${guild.vanityURLCode || "None"}`
                    ].join("\n")
                },
                { name: "Features", value: guild.feratures?.map(feature => `- ${toPascalCase(feature, " ")}`)?.join("\n") || "None", inline: true },
                {
                    name: "Security",
                    value: [
                        `❌ **Explicit Filter: ** ${splitPascal(GuildExplicitContentFilter[guild.explicitContentFilter], " ")}`,
                        `🔞 **NSFW Level: ** ${splitPascal(GuildNSFWLevel[guild.nsfwLevel], " ")}`,
                    ].join("\n"),
                    inline: true
                },
                {
                    name: `Members (${guild.memberCount})`,
                    value: [
                        `😀 **User: ** ${guild.memberCount - botCount}`,
                        `🤖 **Bots: ** ${botCount}`
                    ].join("\n"),
                    inline: true
                },
                { name: `User roles: (${maxDisplayRoles(userRoles)} of ${userRoles.length})`, value: `${userRoles.slice(0, maxDisplayRoles(userRoles)).join(" ") || "None"}` },
                { name: `Bot roles: (${maxDisplayRoles(managedRoles)} of ${managedRoles.length})`, value: `${managedRoles.slice(0, maxDisplayRoles(managedRoles)).join(" ") || "None"}` },
                {
                    name: `Channels, Threads and Categories (${totalChannels})`,
                    value: [
                        `📔 **Text Channels: ** ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildNews])}`,
                        `🎤 **Voice Channels: ** ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
                        `🗄 **Threads** ${getChannelTypeSize([ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildNewsThread])}`,
                    ].join("\n"),
                    inline: true
                },
                {
                    name: `Emojis & Stickers (${emojis.cache.size + stickers.cache.size})`,
                    value: [
                        `📺 **Animated: ** ${emojis.cache.filter(emoji => emoji.animated).size}`,
                        `⚡ **Static: ** ${emojis.cache.filter(emoji => !emoji.animated).size}`,
                        `🎟 **Stickers: ** ${emojis.cache.size}`
                    ].join("\n"),
                    inline: true
                },
                {
                    name: `Nitro`,
                    value: [
                        `📈 **Level: ** ${guild.premiumTier || "None"}`,
                        `💪 **Boosts: ** ${guild.premiumSubscriptionCount}`,
                        `💎 **Total Boosters: ** ${guild.members.cache.filter(member => member.roles.premiumSubscriberRole).size}`,
                    ].join("\n"),
                    inline: true
                },
                { name: "Banner", value: guild.bannerURL() ? "** **" : "None" }
            )
        await interaction.reply({ embeds: [embed] });
    },
};