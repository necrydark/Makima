const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gay')
        .setDescription('Check how gay you are!')
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The person you want to see how gay they are!")),
    async execute(interaction) {
        const { options, user } = interaction;
        const member = options.getMember("user") || user;

        var result = Math.ceil(Math.random() * 100);
        const embed = new EmbedBuilder();

        if (member.id == "255769540825186305") {
            embed.setTitle("🏳️‍🌈・Gay rate").setDescription(`${member} cannot be gay!`).setColor("LuminousVividPink");

            await interaction.reply({ embeds: [embed] })

        }

        embed.setTitle("🏳️‍🌈・Gay rate").setDescription(`${member} you are ${result}% gay!`).setColor("LuminousVividPink");

        await interaction.reply({ embeds: [embed] })
    },
};