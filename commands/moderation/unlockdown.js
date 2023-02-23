const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlockdown')
        .setDescription('(Un)Lockdown the server!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction, client) {
        interaction.guild.channels.cache.forEach(channel => {
            if (channel.type == ChannelType.GuildText) {
                channel.permissionOverwrites.edit(interaction.guild.id, {
                    "SendMessages": true,
                    "AttachFiles": true,
                })
            }
        })

        const embed = new EmbedBuilder()
            .setTimestamp()
            .setTitle("(Un)Lockdown Successfull")
            .setFooter({ text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [embed] })

    }
}