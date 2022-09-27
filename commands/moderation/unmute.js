const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
    permissions: [PermissionFlagsBits.KickMembers],
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('unmutes the user you want!')
        .addUserOption(option => option.setName('target').setDescription('User you want to mute').setRequired(true)),

    async execute(interaction) {
        const target = interaction.options.getMember('target')
        let role = interaction.guild.roles.cache.find(r => r.name === 'muted')

        if (!target) await interaction.reply('You need to add a target!');
        if (!role) await interaction.reply('You need to create a role called muted');

        if (!target.roles.cache.some(r => r.name === 'muted')) {
            await interaction.reply("User is already unmuted!");
        } else {
            if (target) {
                const embed = new EmbedBuilder()
                    .setColor('GREEN')
                    .setDescription(`✅ ${target} has been unmuted`);
                target.roles.remove(role);
                await interaction.reply({ embeds: [embed] });
            }
        }


    },
};