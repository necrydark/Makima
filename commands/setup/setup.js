const { SlashCommandBuilder, ChannelType } = require("discord.js");
const suggestionChannel = require("../../schemas/suggestionChannel");
const wait = require('node:timers/promises').setTimeout


module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestion-setup')
        .setDescription('Manage the bot setup!')
        .addChannelOption(option => option.setName('channel').setDescription('The channel for suggestions').setRequired(true).addChannelTypes(ChannelType.GuildText)),
    async execute(interaction, client) {
        const { options, guildId } = interaction;
        const channel = options.getChannel('channel');

        suggestionChannel.findOne({ GuildID: guildId }, async (err, data) => {
            if (!data) {
                await new suggestionChannel({
                    GuildID: guildId,
                    Channel: channel.id
                }).save();
            }
            else {
                data.Channel = channel.id;
                data.save();
                // await suggestionChannel.findOneAndUpdate({ GuildID: guildId }, {
                //     GuildID: guildId,
                //     Channel: channel.id
                // });
            }

        });


        client.succNormal({
            text: `Channel has been set up successfully!`,
            fields: [
                {
                    name: `📘┆Channel`,
                    value: `${channel} (${channel.id})`
                }
            ],
            type: 'reply'
        }, interaction);
    }
}
