const { EmbedBuilder, Webhook } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('node:timers/promises').setTimeout;
const { get } = require("request-promise-native");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('manga')
        .setDescription('Gets the manga of your choice.')
        .addStringOption(option =>
            option
                .setName('manga')
                .setDescription('The manga you want, use the full JP or English name.')
                .setRequired(true)),
    async execute(interaction) {
        const args = interaction.options.getString('manga') ?? "No Manga";
        if (args.length < 1) {
            interaction.reply("Cannot take that argument.");
        }
        let URL = `https://kitsu.io/api/edge/manga?filter[text]=` + args;
        let option = {
            url: URL,
            method: `GET`,
            headers: {
                'Content-Type': "application/vnd.api+json",
                'Accept': "application/vnd.api+json",
            },
            json: true
        }
        console.log(args);
        await interaction.reply("Fetching info").then(async msg => {
            get(option).then(async mat => {
                const Embed = new EmbedBuilder()
                    .setTitle(`Name: ${mat.data[0].attributes.titles.en_us} "JP:" ${mat.data[0].attributes.titles.ja_jp}`)
                    .setURL(`${mat.data[0].links.self}`)
                    .setTimestamp()
                    .setThumbnail(`${mat.data[0].attributes.posterImage.original}`)
                    .setDescription(`${mat.data[0].attributes.synopsis}`)
                    .setColor('Random')
                    .addFields(
                        { name: "Type", value: `${mat.data[0].attributes.mangaType}`, inline: true },
                        { name: "Published", value: `${mat.data[0].attributes.startDate} **TO** ${mat.data[0].attributes.endDate ? mat.data[0].attributes.endDate : "N/A"}`, inline: true },
                        { name: "Status", value: `${mat.data[0].attributes.status}`, inline: true },
                        { name: "Rank", value: `${mat.data[0].attributes.ratingRank ? mat.data[0].attributes.ratingRank : "N/A"}`, inline: true },
                        { name: "Chapter Count", value: `${mat.data[0].attributes.chapterCount ? mat.data[0].attributes.chapterCount : "N/A"}`, inline: true },
                        { name: "Volume Count", value: `${mat.data[0].attributes.volumeCount ? mat.data[0].attributes.volumeCount : "N/A"}`, inline: true },
                        { name: "Serialization", value: `${mat.data[0].attributes.serialization}`, inline: true },
                        { name: "Averge Rating", value: `${mat.data[0].attributes.averageRating}`, inline: true },
                        // { name: "Genres", value: `${mat.data[0].relationships.genres}`, inline: true },

                    )
                await interaction.editReply({ embeds: [Embed] });
            }).catch(error => {
                console.log(error);
                interaction.editReply("ERROR please use a different name");

            });
        })
    }
}