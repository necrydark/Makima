const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Levels = require('discord.js-leveling');
const Functions = require('../../schemas/functions');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Resets guild ranks')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const { guildId } = interaction;
        const embed = new EmbedBuilder();
        const data = await Functions.findOne({ GuildID: interaction.guild.id });
        if (data && data.Levels == true) {
            Levels.resetXP(guildId);
            embed.setColor('Random')
                .setDescription("Reset XP")
                .setTimestamp()
                .setFooter({ text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
            return interaction.reply({ embeds: [embed] });
        } else {
            interaction.reply({ content: 'Levels are not enabled in this guild!', ephemeral: true })
        }

    },
};