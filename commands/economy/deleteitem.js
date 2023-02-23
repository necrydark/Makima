const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const store = require('../../schemas/economyStore');
// const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteitem')
        .setDescription('delete an item to the store!')
        .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),


    async execute(interaction, client) {
        const { channel, options } = interaction;

        const role = options.getRole('role')

        if (!role) return client.errUsage({ usage: "deleteitem [role]", type: 'reply' }, interaction);



        store.findOne({ GuildID: interaction.guild.id, Role: role.id }, async (err, data) => {
            if (data) {
                var remove = await store.deleteOne({ GuildID: interaction.guild.id, Role: role.id });

                client.succNormal({
                    text: `The role was deleted from the store`,
                    fields: [
                        {
                            name: `🛒┆Role`,
                            value: `${role}`
                        }
                    ],
                    type: 'reply'
                }, interaction);
            } else {

                client.errNormal({
                    error: `This role is not in the store!`,
                    type: 'reply'
                }, interaction);
            }
        })
    },
};