const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Gives information on how fast bot can reply!'),
    async execute(interaction) {
        const { client } = interaction;
        const embed = new EmbedBuilder();
        await interaction.deferReply();
        await wait(4000);
        embed.setTitle("Pong 🏓")
            .addFields(
                { name: `:robot: The Bots Latency`, value: `**${Date.now() - interaction.createdTimestamp}**ms` },
                { name: `:computer: The APIs Latency`, value: `**${client.ws.ping}**ms` },

            )
            .setColor('Random')
            .setTimestamp()
            .setFooter({ text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        await interaction.editReply({ embeds: [embed] });
    },
};