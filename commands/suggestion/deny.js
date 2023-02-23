const { SlashCommandBuilder } = require("discord.js");
const suggestionChannel = require("../../schemas/suggestionChannel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deny')
        .setDescription('Accept a suggestion!')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('The ID of the suggestion you want to accept!')
                .setRequired(true)),
    async execute(interaction, client) {
        const { options } = interaction;
        const suggestionID = options.getString('id');

        const data = await suggestionChannel.findOne({ GuildID: interaction.guild.id });
        if (data) {
            const channel = interaction.guild.channels.cache.get(data.Channel);
            const suggestEmbed = await channel.messages.fetch(suggestionID);
            const embedData = suggestEmbed.embeds[0];

            client.embed({
                title: `${client.emotes.normal.check} Suggestion Denied!`,
                desc: `\`\`\`${embedData.description}\`\`\``,
                author: {
                    name: embedData.author.name,
                    iconURL: embedData.author.iconURL
                },
                footer: {
                    text: `Requested by: ${embedData.author.username}#${embedData.author.discriminator}`,
                    iconURL: embedData.author.iconURL
                },
                type: 'edit'
            }, suggestEmbed)

            try {
                const user = await client.users.cache.find((u) => u.tag === embedData.author.name);

                if (user) {
                    client.embed({
                        title: `${client.emotes.normal.check} Suggestion Denied`,
                        desc: `Your suggestion in ${interaction.guild.name} has been denied by a moderator`,
                        fields: [
                            {
                                name: `💬 Suggestion`,
                                value: `${embedData.description}`
                            }
                        ],
                    }, user).catch({})
                }
            }
            catch { }
            client.succNormal({
                text: "Suggestion successfully denied",
                fields: [
                    {
                        name: `💬 Suggestion`,
                        value: `${embedData.description}`
                    }
                ],
                type: 'reply',
            }, interaction)
        } else {
            client.errNormal({
                error: `No suggestion channel set! Please do the setup`,
                type: 'editreply'
            }, interaction);
        }
    }

}