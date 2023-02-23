const { SlashCommandBuilder, PermissionFlagsBits, Embed, EmbedBuilder } = require('discord.js');
const ticketSchema = require('../../schemas/ticket');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Ticket actions')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Add or remove members from the ticket.')
                .setRequired(true)
                .addChoices(
                    { name: 'Add', value: 'add' },
                    { name: 'Remove', value: 'remove' }
                )
        )
        .addUserOption(option =>
            option.setName('member')
                .setDescription('Select a member')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { guild, options, channel } = interaction;

        const action = options.getString('action')
        const user = options.getUser('member');

        const embed = new EmbedBuilder()

        switch (action) {
            case "add":
                ticketSchema.findOne({ GuildID: guild.id, ChannelID: channel.id }, async (err, data) => {
                    if (err) throw err;
                    if (!data)
                        return interaction.reply({ embeds: [embed.setColor('Red').setDescription('Something went wrong')], ephemeral: true });
                    if (data.MembersID.includes(user.id))
                        return interaction.reply({ embeds: [embed.setColor('Red').setDescription('Something went wrong')], ephemeral: true });

                    data.MembersID.push(user.id)

                    channel.permissionOverwrites.edit(user.id, {
                        SendMessages: true,
                        ViewChannel: true,
                        ReadMessageHistory: true,
                    });

                    interaction.reply({ embeds: [embed.setColor('Green').setDescription(`${user} has been added to this ticket.`)] });

                    data.save();
                });
                break;

            case "remove":
                ticketSchema.findOne({ GuildID: guild.id, ChannelID: channel.id }, async (err, data) => {
                    if (err) throw err;
                    if (!data)
                        return interaction.reply({ embeds: [embed.setColor('Red').setDescription('Something went wrong')], ephemeral: true });
                    if (!data.MembersID.includes(user.id))
                        return interaction.reply({ embeds: [embed.setColor('Red').setDescription('Something went wrong')], ephemeral: true });

                    data.MembersID.remove(user.id)

                    channel.permissionOverwrites.edit(user.id, {
                        SendMessages: false,
                        ViewChannel: false,
                        ReadMessageHistory: false,
                    });

                    interaction.reply({ embeds: [embed.setColor('Green').setDescription(`${user} has been removed to this ticket.`)] });

                    data.save();
                });
                break;
        }
    }
}