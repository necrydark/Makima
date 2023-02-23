const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, ChannelType } = require('discord.js');
const levelChannelSchema = require('../../schemas/levelChannel');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level-channel')
        .setDescription('Choose the level channel!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select the channel where you want the tickets to created at.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
    ,
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const { options } = interaction;
        const embed = new EmbedBuilder();

        const channel = options.getChannel('channel');

        levelChannelSchema.findOne({ GuildID: interaction.guild.id }, async (err, data) => {
            if (!data) {
                data = new levelChannelSchema({
                    GuildID: interaction.guild.id,
                    Channel: channel.id
                })
            } else {
                await levelChannelSchema.findOneAndUpdate({ GuildID: interaction.guild.id }, {
                    Channel: channel.id
                });
            }
            data.save();
        })

        embed.setDescription(`Level channel is now set!`);
        await interaction.reply({ embeds: [embed] });

    },
};



