const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fatty')
        .setDescription('Replies with Pong!')
        .addStringOption(option =>
            option
                .setName('example')
                .setDescription('example')
                .setRequired(false)),
    async execute(interaction) {
        const { options } = interaction;
        const example = options.getString('example')
        await interaction.reply({ content: `${example}` });
    },
};