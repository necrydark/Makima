const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => option.setName('channel').setDescription('The channel to lockdown').setRequired(true))
        .setDescription('Locks the channel'),
    async execute(interaction) {
        let channel = interaction.options.getChannel('channel');
        channel.permissionOverwrites.edit(channel.guild.roles.everyone.id, {
            "SendMessages": false,
            "AttachFiles": false,
        })
            .catch(console.error);
        await interaction.reply('Channel has been locked!')
    },
}