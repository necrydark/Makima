const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('simp')
        .setDescription('Check how simp you are!')
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The person you want to see how simp they are!")),
    async execute(interaction) {
        const { options, user } = interaction;
        const member = options.getMember("user") || user;

        var result = Math.ceil(Math.random() * 100);
        const embed = new EmbedBuilder();

        embed.setTitle("👀・simp rate").setDescription(`${member} you are ${result}% simp!`).setColor("LuminousVividPink");

        await interaction.reply({ embeds: [embed] })
    },
};