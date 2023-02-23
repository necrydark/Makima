const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const tempBanSchema = require('../../schemas/tempban');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tempban')
        .setDescription('Temp ban a user!')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user you want to tempban')
                .setRequired(true))
        .addNumberOption(option => option.setName('time').setDescription('Number of minutes').setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason why the user wants to be banned')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, client) {
        const { options, user } = interaction;
        const member = options.getUser('target') || user;
        const time = options.getNumber('time');
        const reason = options.getString('reason') || 'Not Given';
        // const fetchedMember = interaction.guild.members.fetch(member.id);

        if (member.permissions.has(PermissionFlagsBits.BanMembers) || member.permissions.has(PermissionFlagsBits.Administrator)) return client.errNormal({
            error: `You can't ban a moderator`,
            type: 'reply'
        }, interaction)

        client.embed({
            title: `🔨 Ban`,
            desc: `You've been banned in **${interaction.guild.name}**`,
            fields: [
                {
                    name: `🧑 Banned By`,
                    value: interaction.user.tag,
                    inline: true
                },
                {
                    name: `🗨 Reason`,
                    value: reason,
                    inline: true
                }
            ]
        }, member).then(async function () {
            member.ban({ reason: reason })
            client.succNormal({
                text: "The user has been banned and received a notification!",
                fields: [
                    {
                        name: `🧑 Banned User`,
                        value: member.user.tag,
                        inline: true
                    },
                    {
                        name: `🗨 Reason`,
                        value: reason,
                        inline: true
                    }
                ],
                type: 'reply'
            }, interaction);

            const expires = new Date();
            expires.setMinutes(expires.getMinutes() + parseInt(time));

            await new tempBanSchema({
                guildId: interaction.guild.id,
                userId: member.id,
                expires,
            }).save();
        }).catch(async function () {
            member.ban({ reason: reason });
            client.succNormal({
                text: "The user has been banned, but has not received a notification",
                type: "reply"
            }, interaction);

            const expires = new Date();
            expires.setMinutes(expires.getMinutes() + parseInt(time));

            await new tempBanSchema({
                guildId: interaction.guild.id,
                userId: member.id,
                expires,
            }).save();
        })

    },
};