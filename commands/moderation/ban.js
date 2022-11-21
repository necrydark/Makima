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


    async execute(interaction) {
        const { channel, options } = interaction;

        const target = interaction.options.getMember('target')
        const reason = interaction.options.getString('reason') || "No Reason Provided";

        const member = await interaction.guild.members.fetch(target.id);

        const errEmbed = new EmbedBuilder()
            .setDescription(`You can't take action on ${user.username} since they have a higher role.`)
            .setColor(0xc72c3b);

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephermal: true })

        await member.ban({ reason });

        const embed = new EmbedBuilder()
            .setDescription(`Succesfully banned ${user} with reason: ${reason}`)
            .setColor("Green")
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
        // if (!target) await interaction.reply('You need to add a target!');

        // if (target && !reason) {
        //     const embed = new EmbedBuilder()
        //         .setColor('Red')
        //         .setDescription(`✅ ${target} has been banned`);
        //     target.ban()
        //     await interaction.reply({ embeds: [embed] });
        // } else {
        //     const embed = new EmbedBuilder()
        //         .setColor('Red')
        //         .setDescription(`✅ ${target} has been banned for ${reason}`);
        //     target.ban();
        //     await interaction.reply({ embeds: [embed] });

        // }
    },
};