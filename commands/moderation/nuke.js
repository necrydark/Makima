const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDescription('Nukes a channel!')
    ,
    async execute(interaction) {

        const embed = new EmbedBuilder();
        interaction.channel.clone().then((channel) => {
            channel.setPosition(interaction.channel.position).then(
                interaction.channel.delete()
            );
            embed.setTitle(`Channel nuked by **${interaction.user.tag}**`).setImage(`https://i.imgur.com/Da7ScU4.gif`);
            return interaction.reply({ embeds: [embed] })
        })
    },
};