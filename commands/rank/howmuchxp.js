const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Levels = require('discord.js-leveling');
const Functions = require('../../schemas/functions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('howmuchxp')
        .setDescription('See how much xp it takes to reach a desired level!')
        .addIntegerOption(option =>
            option.setName("level")
                .setDescription("Desired Level")
                .setRequired(true)),
    async execute(interaction, client) {

        const { options } = interaction;

        const data = await Functions.findOne({ GuildID: interaction.guild.id });
        const level = options.getInteger("level")


        if (data && data.Levels == true) {
            const xpAmount = Levels.xpFor(level);
            interaction.reply({ content: `You need ${xpAmount} xp to reach level ${level}.`, ephemeral: true });
        } else {
            interaction.reply({ content: 'Levels are not enabled in this guild!', ephemeral: true })
        }
    },
};