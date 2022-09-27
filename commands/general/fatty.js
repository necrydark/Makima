const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fatty')
        .setDescription('Fatty with Pong!'),
    async execute(interaction) {
        await interaction.reply('Fatty Batty')
    },
};