const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
// const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('unbans the user you want!')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('Discord ID of the user you want to unban')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),


    async execute(interaction) {
        const { channel, options } = interaction;

        const userId = interaction.options.getString('userid');

        try {
            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
                .setDescription(`Succesfully unbanned ${userId} from the guild`)
                .setColor("Green")
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);

            const errEmbed = new EmbedBuilder()
                .setDescription(`Please provide a valid member's ID.`)
                .setColor(0xc72c3b);

            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
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