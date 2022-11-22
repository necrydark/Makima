const { SlashCommandBuilder, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, ButtonStyle, ChannelType } = require('discord.js');
const ticketSetup = require('../../schemas/ticketsetup');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('Creates a ticket message!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select the channel where you want the tickets to created at.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
        .addChannelOption(option =>
            option.setName('category')
                .setDescription('Select the ticket category')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory))
        .addChannelOption(option =>
            option.setName('transcripts')
                .setDescription('Select the channel where the transcripts should be sent.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
        .addRoleOption(option =>
            option.setName('handlers')
                .setDescription('Selects the ticket handlers roles')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('everyone')
                .setDescription('Tag the everyone role')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Set the description for the ticket embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('firstbutton')
                .setDescription('Format:[Name of button]')
                .setRequired(true)),
    async execute(interaction) {
        const { guild, options } = interaction;

        try {
            const channel = options.getChannel('channel');
            const category = options.getChannel('category');
            const transcripts = options.getChannel('transcripts');

            const handlerRole = options.getRole('handlers');
            const everyoneRole = options.getRole('everyone');

            const description = options.getString('description');
            const firstButton = options.getString('firstbutton');

            await ticketSetup.findOneAndUpdate({ GuildID: guild.id },
                {
                    Channel: channel.id,
                    Catergory: category.id,
                    Transcripts: transcripts.id,
                    Handlers: handlerRole.id,
                    Everyone: everyoneRole.id,
                    Description: description,
                    Buttons: [firstButton]
                },
                {
                    new: true,
                    upsert: true,
                });


            const button = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId(firstButton).setLabel(firstButton).setStyle(ButtonStyle.Primary),
            );

            const embed = new EmbedBuilder()
                .setDescription(description)


            await guild.channels.cache.get(channel.id).send({
                embeds: ([embed]),
                components: [
                    button
                ]
            });
            interaction.reply({ content: "Ticket message has been sent", ephemeral: true })
        } catch (error) {
            console.log(error);
            const errEmbed = new EmbedBuilder()
                .setDescription('Something went wrong')



            return interaction.reply({ embeds: [errEmbed], ephemeral: true })
        }


    },
};