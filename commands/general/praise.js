const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('praise')
        .setDescription('Mommy!')
        .addUserOption(option =>
            option.setName("user")
                .setDescription("the!")),
    async execute(interaction) {
        const { options, user } = interaction;
        const member = options.getMember("user") || user;



        await interaction.reply({ content: `You're a good boy ${member}` });
    },
};
