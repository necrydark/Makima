const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stank')
        .setDescription('Check how stank you are!')
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The person you want to see how stank they are!")),
    async execute(interaction) {
        const { options, user } = interaction;
        const member = options.getMember("user") || user;

        var result = Math.ceil(Math.random() * 100);
        const embed = new EmbedBuilder();

        embed.setTitle("💨・stank rate").setDescription(`${member} you are ${result}% stank!`).setColor("LuminousVividPink");

        await interaction.reply({ embeds: [embed] })
    },
};