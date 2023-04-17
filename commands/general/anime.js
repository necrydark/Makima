const { EmbedBuilder, Webhook } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { get } = require("request-promise-native");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Gets the anime of your choice. Use the full JP or English name.')
        .addStringOption(option =>
            option
                .setName('anime')
                .setDescription('The anime you want')
                .setRequired(true)),
    async execute(interaction) {
        const args = interaction.options.getString('anime') ?? "No Anime";
        if (args.length < 1) {
            interaction.reply("Cannot take that argument.");
        }
        let URL = `https://kitsu.io/api/edge/anime?filter[text]=` + args;
        let option = {
            url: URL,
            method: `GET`,
            headers: {
                'Content-Type': "application/vnd.api+json",
                'Accept': "application/vnd.api+json",
            },
            json: true
        }
        await interaction.reply("Fetching info").then(msg => {
            get(option).then(mat => {
                console.log(mat.data[0].relationships.genres.links.self);
                const Embed = new EmbedBuilder()
                    .setTitle(`Name: ${mat.data[0].attributes.titles.en_jp} JP: ${mat.data[0].attributes.titles.ja_jp}`)
                    // .setURL(`${mat.data[0].links.self}`)
                    .setTimestamp()
                    .setThumbnail(`${mat.data[0].attributes.posterImage.original}`)
                    .setDescription(`${mat.data[0].attributes.synopsis}`)
                    .setColor('Random')
                    .addFields(
                        { name: "Type", value: `${mat.data[0].attributes.showType}`, inline: true },
                        { name: "Published", value: `${mat.data[0].attributes.startDate} **TO** ${mat.data[0].attributes.endDate ? mat.data[0].attributes.endDate : "N/A"}`, inline: true },
                        { name: "Status", value: `${mat.data[0].attributes.status}`, inline: true },
                        { name: "Next Release", value: `${mat.data[0].attributes.nextRelease ? mat.data[0].attributes.nextRelease : "N/A"}`, inline: true },
                        { name: "Episode Count", value: `${mat.data[0].attributes.episodeCount ? mat.data[0].attributes.episodeCount : "N/A"}`, inline: true },
                        { name: "Duration", value: `${mat.data[0].attributes.episodeLength ? mat.data[0].attributes.episodeLength : "N/A"}`, inline: true },
                        { name: "Rank", value: `${mat.data[0].attributes.ratingRank}`, inline: true },
                        { name: "Averge Rating", value: `${mat.data[0].attributes.averageRating}`, inline: true },
                    )

                interaction.editReply({ embeds: [Embed] });
            }).catch(error => {
                console.log(error);
                interaction.editReply("ERROR please use a different name.");
            })
        })
    }
}