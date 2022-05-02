const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays all the commands'),
    async execute(interaction) {
        const embed = new MessageEmbed()
        .setTitle("Help")
        .addFields(
            {name: '/avatar', value: 'Displays users avatar. **/avatar or /avatar [target:]**'},
            {name: '/ping', value: 'Replies with pong. **/ping**'},
        )
        .setFooter(`Requested by: ${interaction.user.username}#${interaction.user.discriminator}`, interaction.user.displayAvatarURL({dynamic: true}));

        await interaction.reply({ embeds: [embed]})
    }
}