const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
// const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('bans the user you want!')

        .addUserOption(option => option.setName('target').setDescription('User you want to ban').setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason as to why user needs to be banned')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),


    async execute(interaction, client) {
        const { channel, options } = interaction;

        const target = interaction.options.getMember('target')
        const reason = interaction.options.getString('reason') || "No Reason Provided";

        const member = await interaction.guild.members.fetch(target.id);

        if (member.permissions.has(PermissionFlagsBits.BanMembers) || member.permissions.has(PermissionFlagsBits.Administrator)) return client.errNormal({
            error: `You can't ban a moderator`,
            type: 'reply'
        }, interaction)

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return client.errNormal({
                error: `You can't take action on ${user.username} since they have a higher role`,
                type: 'reply'
            }, interaction)

        // await member.ban({ reason });

        // client.embed({
        //     title: `🔨 Ban`,
        //     desc: `You've been banned in **${interaction.guild.name}**`,
        //     fields: [
        //         {
        //             name: `🧑 Banned By`,
        //             value: interaction.user.tag,
        //             inline: true
        //         },
        //         {
        //             name: `🗨 Reason`,
        //             value: reason,
        //             inline: true
        //         }
        //     ]
        // }, interaction)

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
        }, member).then(function () {
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
        }).catch(function () {
            member.ban({ reason: reason })
            client.succNormal({
                text: "The given user has been successfully banned, but has not received a notification!",
                type: 'reply'
            }, interaction)
        })
    },
};