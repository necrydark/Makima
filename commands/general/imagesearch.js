const { MessageEmbed, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get')
        .setDescription('Gets image')
        .addStringOption(option =>
            option
                .setName('argument')
                .setDescription('The image you want')
                .setRequired(true)),
    async execute(interaction) {
        const args = interaction.options.getString('argument') ?? "No Argument";
        args.forEach(function (arg, key) {
            if (arg.includes("@")) {
                args.splice(key, 1);
            }
        });
        const argsString = args.join(" ");
        console.log("search: " + argsString);

        axios
            .get('https://api.waifu.pics/sfw/' + argsString)
            .then(async response => {
                console.log(`statusCode: ${response.status}`)
                console.log(response['data'].url)

                const embed = new EmbedBuilder()
                    .setTitle(argsString)
                    .setColor("#34ebcf")
                    .setImage(response['data'].url)
                    .setFooter(`Requested By: ${message.author.username}#${message.author.discriminator}`, client.user.displayAvatarURL({ format: 'png', dynamic: true }));
                return await interaction.reply({ embeds: [embed] });
            })
            .catch(error => {
                console.error(error)
            })
    }
}