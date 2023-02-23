const { SlashCommandIntegerOption, time } = require('@discordjs/builders');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();
const moment = require('moment');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Gets information about a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select a user')
                .setRequired(false)),
    timeout: 10000,
    async execute(interaction) {
        const { options } = interaction;
        const user = options.getUser("user") || interaction.user;
        const member = await interaction.guild.members.cache.get(user.id);
        const { roles } = member;
        const icon = user.displayAvatarURL();
        const tag = user.tag;
        const formatter = new Intl.ListFormat('en-GB', { style: 'narrow', type: 'conjunction' });
        const embed = new EmbedBuilder();

        await user.fetch();

        const badges = {
            BugHunterLevel1: "Bug Hunter",
            BugHunterLevel2: "Bug Buster",
            CertifiedModerator: "Discord Certified Moderator",
            HypeSquadOnlineHouse1: "House Of Bravery",
            HypeSquadOnlineHouse2: "House Of Brilliance",
            HypeSquadOnlineHouse3: "House Of Balance",
            Hypesquad: "HypeSquad Event Attendee",
            Partner: "Discord Partner",
            PremiumEarlySupporter: "Early Nitro Supporter",
            Staff: "Discord Staff",
            VerifiedBot: "Verified Bot",
            VerifiedDeveloper: "Verified Developer"
        };

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

        const sortedRoles = roles.cache.map(role => role).sort((a, b) => b.position - a.position).slice(0, roles.cache.size - 1);
        const userFlags = user.flags.toArray();

        axios.get(`https://discord.com/api/users/${user.id}`, {
            headers: {
                Authorization: `Bot ${process.env.token}`,
            },
        })
            .then((res) => {
                console.log(res.data);
                const { banner, accent_color } = res.data;

                if (banner) {
                    const extension = banner.startsWith("a_") ? '.gif' : '.png';
                    const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=1024`;

                    embed
                        .setAuthor({ name: tag, iconURL: icon })
                        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
                        .addFields(
                            {
                                name: "__User Info__", value: `**ID** ${user.id}\n**Profile ** ${tag}\n**Bot ** ${user.bot}\n** Created** ${moment(member.user.createdAt).format('DD/MM/YYYY')}`
                            },
                            {
                                name: "__Member Info__", value: `**Nickname ** ${member.nickname || tag} \n**Joined **  ${moment(member.joinedAt).format('DD/MM/YYYY')}`
                            },
                            {
                                name: `__Roles (${maxDisplayRoles(sortedRoles)} of ${sortedRoles.length})__`, value: `${sortedRoles.slice(0, maxDisplayRoles(sortedRoles)).join(' ') || 'None'}`
                            },
                            { name: "__Badges__", value: userFlags.length ? formatter.format(userFlags.map(flag => `**${badges[flag]}**`)) : 'None' }
                        )
                        .setImage(url);
                    return interaction.reply({ embeds: [embed] });
                } else {
                    if (accent_color) {
                        embed
                            .setAuthor({ name: tag, iconURL: icon })
                            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
                            .setDescription(`${tag}'s banner`)
                            .addFields(
                                {
                                    name: "__User Info__", value: `**ID** ${user.id}\n**Profile ** ${tag}\n**Bot ** ${user.bot}\n** Created At** <t:${parseInt(member.user.createdAt / 1000)}:R>`
                                },
                                {
                                    name: "__Member Info__", value: `**Nickname ** ${member.nickname} \n**Joined **  <t:${parseInt(member.joinedAt / 1000)}:R> `
                                },
                                {
                                    name: `__Roles (${maxDisplayRoles(sortedRoles)} of ${sortedRoles.length})__`, value: `${sortedRoles.slice(0, maxDisplayRoles(sortedRoles)).join(' ') || 'None'}`
                                },
                                { name: "__Badges__", value: userFlags.length ? formatter.format(userFlags.map(flag => `**${badges[flag]}**`)) : 'None' }
                            )
                            .setColor(accent_color)
                        return interaction.reply({ embeds: [embed] });
                    } else {
                        return interaction.reply("User doesn't have a banner nor an accent colour")
                    }
                }
            })
    },
};