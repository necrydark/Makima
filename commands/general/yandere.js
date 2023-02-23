const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { EmbedBuilder, Embed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yandere')
        .setDescription('Replies with images based on your tag!')
        .addStringOption(option =>
            option
                .setName('tag')
                .setDescription('The tag you want to search!')
                .setRequired(true)),
    developer: true,
    async execute(interaction) {
        const { options } = interaction;
        const tag = options.getString('tag')
        //https://yande.re/post.json?api_version=2

        axios
            .get(`https://yande.re/post.json?api_version=2&${tag}&limit=1`)
            .then(async response => {
                console.log(response['data'].posts);
                const embed = new EmbedBuilder()
                    .setTitle(`Tag: ` + tag)
                    // .setAuthor(`${response['data'].posts.author}`)
                    .setColor('Green')
                    .setThumbnail(response['data'].posts.preview_url)
                    .addFields(
                        { name: 'Tags', value: `${response['data'].posts.tags}` },
                        { name: 'Rating', value: `${response['data'].posts.rating}` },
                        { name: 'Status', value: `${response['data'].posts.status}` }

                    )
                    .setFooter({
                        text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setTimestamp();
                return await interaction.reply({ embeds: [embed] });

            })
            .catch((error) => {
                console.error(error);
            });
    },
};