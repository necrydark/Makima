const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
    ,
    timeout: 10000,
    async execute(interaction) {
        const {client} = interaction;
        const embed = new EmbedBuilder();
        await interaction.deferReply();
        await wait(4000);
        embed.setTitle('Pong 🏓')
        .addFields(
            {name: `:robot: The Bots Latency`, value: `**${Date.now() - interaction.createdTimestamp}**ms`},
            { name: ':desktop: The APIs Latency', value: `**${Math.round(client.ws.ping)}**ms`}
        )
        .setColor('Random')
        .setFooter({ text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();
        await interaction.editReply({embeds: [embed]});
        //  await interaction.editReply(`Pong: 🎾 \n${(Date.now() - interaction.createdTimestamp)} + ms`)
    },
};