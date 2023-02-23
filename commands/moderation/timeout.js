const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user!')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user you want to timeout')
                .setRequired(true))
        .addNumberOption(option => option.setName('time').setDescription('Number of minutes').setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Timeout reason')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, client) {
        const { options, user } = interaction;
        const member = options.getUser('target') || user;
        const time = options.getNumber('time');
        const reason = options.getString('reason') || 'Not Given';
        // const fetchedMember = interaction.guild.members.fetch(member.id);

        if (member.isCommunicationDisabled()) return client.errNormal({
            error: `${user} is already timed out!`,
            type: 'reply'
        }, interaction);

        user.timeout(time * 60 * 1000, reason).then(u => {
            client.succNormal({
                text: `${user} has been timed out for **${time} minutes**`,
                fields: [
                    {
                        name: `💬 Reason`,
                        value: `${reason}`
                    }
                ],
                type: 'reply'
            }, interaction)
        }).catch(e => {
            client.errNormal({
                error: `I can't timeout ${user.tag}`,
                type: 'reply'
            }, interaction)
        })
    },
};