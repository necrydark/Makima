const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');
const functions = require('../../schemas/functions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economy-setup')
        .setDescription('Toggle economy system on and off!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption(option =>
            option.setName('set')
                .setDescription('Turn economy on or off!')
                .setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const { options } = interaction;
        const embed = new EmbedBuilder();

        const bool = options.getBoolean('set');

        functions.findOne({ GuildID: interaction.guild.id }, async (err, data) => {
            if (!data) {
                data = new functions({
                    GuildID: interaction.guild.id,
                    Economy: bool
                })
            } else {
                await functions.findOneAndUpdate({ GuildID: interaction.guild.id }, {
                    Economy: bool
                });
                // await functions.create({
                //     GuildID: interaction.guild.id,
                //     Levels: bool
                // })
            }
            data.save();
        })

        embed.setDescription(`Economy is now **${bool ? 'enabled' : 'disabled'}**`);
        await interaction.reply({ embeds: [embed] });

    },
};