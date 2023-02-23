module.exports = (client) => {
    client.createChannelSetup = async function (Schema, channel, interaction) {
        Schema.findOne({ GuildID: interaction.guild.id }, async (err, data) => {
            if (data) {
                data.Channel = channel.id;
                data.save();
            }
            else {
                new Schema({
                    GuildID: interaction.guild.id,
                    ChannelID: channel.id
                }).save();
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