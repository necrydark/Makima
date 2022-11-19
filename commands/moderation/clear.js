const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption(option => option.setName('number').setDescription('Number of mesages to delete').setMinValue(1).setMaxValue(100).setRequired(true))
        .addUserOption(option => option.setName('target').setDescription('User you want to ban').setRequired(true))
        .setDescription('Clears users messages in bulk'),
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const number = interaction.options.getInteger('number');
        const { channel } = interaction;

        const messages = await channel.messages.fetch({
            limit: number,
        });

        const res = new EmbedBuilder()
            .setColor("Random")

        if (target) {
            let i = 0;
            const filtered = [];

            (await messages).filter((msg) => {
                if (msg.author.id === target.id && number > 1) {
                    filtered.push(msg);
                    i++;
                }
            });

            await channel.bulkDelete(filtered).then(messages => {
                res.setDescription(`Succesfully deleted ${messages.size} messages from ${target}`);
                interaction.reply({ embeds: [res], ephemeral: true });
            });
        }
    }
}