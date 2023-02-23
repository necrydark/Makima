const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
// const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banlist')
        .setDescription('Gets a list of all users banned in this server!')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),


    async execute(interaction, client) {
        const { channel, options } = interaction;

        interaction.guild.bans.fetch().then(async banned => {
            let list = banned.map(banUser => `${banUser.user.tag}: **Reason:** ${banUser.reason || "No reason"}`);

            if (list.length == 0) return client.errNormal({
                error: `This server has no bans!`,
                type: 'reply'
            }, interaction)

            await client.createLeaderboard(`🔧・Banlist - ${interaction.guild.name}`, list, interaction);
        }).catch(error => {
            console.log(error);
        })


    },
};