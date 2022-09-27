const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays all the commands'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
        .setTitle("Help")
        .addFields(
            {name: '/avatar', value: 'Displays users avatar. **/avatar or /avatar [target:]**'},
            {name: '/ping', value: 'Replies with pong. **/ping**'},
        )
        .setFooter({ text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`, iconURL:interaction.user.displayAvatarURL({dynamic: true})});

        const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Nothing Selected')
            .addOptions(
                [{
                    label: 'Select me',
                    description: 'This is a description',
                    value: 'First Option'
                },
                {
                    label:'You can select me too',
                    description: 'This is the second description',
                    value: 'Second Option'
                },
                {
                    label:'You can select me too',
                    description: 'This is the third description',
                    value: 'Third Option'
                }],
            ),
        );
        await interaction.reply({ embeds: [embed], components: [row]})
    }
};