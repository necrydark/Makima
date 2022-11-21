const { ChannelType, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const ticketSchema = require('../../schemas/ticket');
const ticketSetup = require('../../schemas/ticketsetup');
require('dotenv').config();

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        const { guild, member, customId, channel } = interaction;
        const { ViewChannel, SendMessages, ManageChannels, ReadMessageHistory } = PermissionFlagsBits;
        const ticketId = Math.floor(Math.random() * 9000) + 10000;

        if (!interaction.isButton()) return;

        const data = await ticketSetup.findOne({ GuildID: guild.id });

        if (!data)
            return;

        if (!data.Buttons.includes(customId))
            return;

        if (!guild.members.me.permissions.has(ManageChannels))
            interaction.reply({ content: "I don't have permissions for this", ephermeral: true })

        try {
            await guild.channels.create({
                name: `${member.user.username}-ticket${ticketId}`,
                type: ChannelType.GuildText,
                parent: data.Category,
                permissionOverwrites: [
                    {
                        id: data.Everyone,
                        deny: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                    {
                        id: member.id,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                ],
            }).then(async (channel) => {
                const newTicketSchema = await ticketSchema.create({
                    GuildID: guild.id,
                    MembersID: member.id,
                    TicketID: ticketId,
                    ChannelID: channel.id,
                    Closed: false,

                    Type: customId,
                    Claimed: false,
                });

                const embed = new EmbedBuilder()
                    .setTitle(`${guild.name} - Ticket: ${customId}`)
                    .setDescription("Our team will contact you shortly, please describe your issue!")
                    .setFooter({ text: `${ticketId}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();

                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('close').setLabel('Close Ticket').setStyle(ButtonStyle.Danger),
                    //new ButtonBuilder().setCustomId('lock').setLabel('Lock Ticket').setStyle(ButtonStyle.Secondary),
                    // new ButtonBuilder().setCustomId('unlock').setLabel('Unlock Ticket').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId('claim').setLabel('Claim Ticket').setStyle(ButtonStyle.Secondary)

                );

                channel.send({
                    embeds: ([embed]),
                    components: [
                        button
                    ]
                });

                interaction.reply({ content: "Succesfully created a ticket", ephemeral: true });
            })
        } catch (err) {
            return console.log(err);
        }
    }
}