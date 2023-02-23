const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamer')
        .setDescription('Check how epic gamer you are!')
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The person you want to see how epic gamer they are!")),
    async execute(interaction) {
        const { options, user } = interaction;
        const member = options.getMember("user") || user;

        var result = Math.ceil(Math.random() * 100);
        const embed = new EmbedBuilder();

        embed.setTitle("🎮・Epic Gamer rate").setDescription(`${member} you are ${result}% epic gamer!`).setColor("LuminousVividPink");

        await interaction.reply({ embeds: [embed] })
    },
};