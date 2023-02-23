const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, ButtonStyle, ComponentType } = require('discord.js');
const economy = require('../../schemas/economy');
const economyStore = require('../../schemas/economyStore');
const economyTimeout = require('../../schemas/economyTimeout');
// const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eco-clear')
        .setDescription('Clear the server!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const { channel, user } = interaction;

        const row = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId('eco_go')
                    .setEmoji('✅')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('eco_stop')
                    .setEmoji('❌')
                    .setStyle(ButtonStyle.Danger),
            );

        client.embed({
            title: `⏰・Reset economy`,
            desc: `Are you sure you want to reset the economy?`,
            components: [row],
            type: 'reply',
        }, interaction)

        const filter = i => i.user.id === interaction.user.id;

        interaction.channel.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000 }).then(async i => {
            if (i.customId == "eco_go") {
                var ecoRemove = await economy.deleteMany({ GuildID: interaction.guild.id });
                var ecoStoreRemove = await economyStore.deleteMany({ GuildID: interaction.guild.id });
                var ecoTimeRemove = await economyTimeout.deleteMany({ GuildID: interaction.guild.id });

                client.succNormal({
                    text: `The economy has been successfully reset in this guild!`,
                    components: [],
                    type: 'reply'
                }, interaction);
            }

            if (i.customId == "eco_stop") {
                client.errNormal({
                    error: `The economy reset has been cancelled!`,
                    components: [],
                    type: 'reply'
                }, interaction);
            }
        })
            .catch(() => {
                client.errNormal({
                    error: "Time's up! Cancelled the economy reset!",
                    type: 'reply'
                }, interaction);
            });

    },
};