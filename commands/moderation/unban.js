const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
// const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('unbans the user you want!')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('Discord ID of the user you want to unban')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),


    async execute(interaction, client) {
        const { channel, options } = interaction;

        const user = interaction.options.getString('user');

        interaction.guild.members.unban(user).then(async function () {
            var member = await interaction.guild.members.cache.get(user);
            client.succNormal({
                text: "The specified user has been successfully unbanned",
                fields: [
                    {
                        name: `🧑 User`,
                        value: member ? member.user.tag : user,
                        inline: true
                    }
                ],
                type: 'reply'
            }, interaction)
        }).catch(function (e) {
            return client.errNormal({
                error: `I couldn't find the user you specified`,
                type: 'reply'
            }, interaction)
        })

    },
};