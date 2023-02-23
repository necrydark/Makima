const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription('Get all servers the bot is in!'),
    developer: true,
    async execute(interaction, client) {
        var list = "";
        client.guilds.cache.forEach(guild => {
            list += ` Guild Name: ${guild.name} ID: ${guild.id} | ${guild.memberCount} members | Owner ID: ${guild.ownerId}\n`
        })

        const output = new AttachmentBuilder(Buffer.from(list), { name: 'servers.txt' });
        await wait(4000);
        await interaction.reply({ files: [output] });

    },
};