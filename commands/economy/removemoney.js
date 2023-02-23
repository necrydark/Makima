const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const economy = require('../../schemas/economy');
// const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removemoney')
        .setDescription('remove money from a user!')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addNumberOption(option => option.setName('amount').setDescription('Enter a amount').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),


    async execute(interaction, client) {
        const { channel, options, user } = interaction;

        const member = options.getMember('user') || user;
        let amount = options.getNumber('amount');

        if (!user || !amount) return client.errUsage({ usage: "addmoney [user] [amount]", type: 'reply' }, interaction);

        if (isNaN(amount)) return client.errNormal({ error: "Enter a valid number!", type: 'reply' }, interaction);

        if (user.bot) return client.errNormal({
            error: "You cannot add money to a bot!",
            type: 'reply'
        }, interaction);


        client.removeMoney(interaction, user, parseInt(amount));

        setTimeout(() => {
            economy.findOne({ GuildID: interaction.guild.id, User: member.id }, async (err, data) => {
                if (data) {
                    client.succNormal({
                        text: `Removed money from a user!`,
                        fields: [
                            {
                                name: `👤┆User`,
                                value: `<@!${user.id}>`,
                                inline: true
                            },
                            {
                                name: `${client.emotes.economy.coins}┆Amount`,
                                value: `$${amount}`,
                                inline: true
                            }
                        ],
                        type: 'reply'
                    }, interaction);
                } else {
                    client.errNormal({ error: `This user doesn't have any money!`, type: 'reply' }, interaction);
                }
            })
        }, 500)


    },
};