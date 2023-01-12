const moment = require('moment');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { InteractionCollector } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fatty')
        .setDescription('Fatty with Pong!')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('The user you want to check')
            .setRequired(true)),
    async execute(interaction) {
        const {options, user, guild } = interaction;
        const target = options.getUser("user") || user;
        const member = guild.members.cache.get(target.id);
        const created = moment(member.createdAt).format('DD/MM/YYYY');
        const joined = moment(member.joinedTimestamp).format('DD/MM/YYYY');

        await interaction.reply({content: `Created: ${created} \n Joined: ${joined} `})
    },
};