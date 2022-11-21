const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
// const { PermissionsBitField } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Mutes the user you want!')

        .addUserOption(option => option.setName('target').setDescription('User you want to kick').setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason as to why user needs to be kicked')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const { channel, options } = interaction;
        const target = options.getMember('target')
        const reason = options.getString('reason');

        if (!target) await interaction.reply('You need to add a target!');

        const errEmbed = new EmbedBuilder()
            .setDescription(`You can't take action on ${user.username} since they have a higher role.`)
            .setColor(0xc72c3b)

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        if (target && !reason) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`✅ ${target} has been kicked`);
            target.kick()
            await interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`✅ ${target} has been kicked for ${reason}`);
            target.kick();
            await interaction.reply({ embeds: [embed] });

        }
    },
};