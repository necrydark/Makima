const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockdown')
        .setDescription('Lockdown the server!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction, client) {
        interaction.guild.channels.cache.forEach(channel => {
            if (channel.type == ChannelType.GuildText) {
                channel.permissionOverwrites.edit(interaction.guild.id, {
                    "SendMessages": false,
                    "AttachFiles": false,
                })
            }
        })

        const embed = new EmbedBuilder()
            .setTimestamp()
            .setTitle("Lockdown Successfull")
            .setFooter({ text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [embed] })
    }
}