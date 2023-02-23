const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clever')
        .setDescription('Check how clever you are!')
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The person you want to see how clever they are!")),
    async execute(interaction) {
        const { options, user } = interaction;
        const member = options.getMember("user") || user;

        var result = Math.ceil(Math.random() * 100);
        const embed = new EmbedBuilder();

        embed.setTitle("🤓・Clever rate").setDescription(`${member} you are ${result}% Clever!`).setColor("LuminousVividPink");

        await interaction.reply({ embeds: [embed] })
    },
};