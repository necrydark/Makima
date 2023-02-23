const { MessageEmbed, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get')
        .setDescription('Gets image')
        .addSubcommand(subcommand =>
            subcommand.setName("sfw")
                .setDescription("Searches an sfw image")
                .addStringOption(option =>
                    option.setName('argument').
                        setDescription('What type of image you want to search').
                        setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("nsfw")
                .setDescription("Searches an nsfw image")
                .addStringOption(option =>
                    option.setName('argument').
                        setDescription('What type of image you want to search.').
                        setRequired(true))),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand(["sfw", "nsfw"]);
        const args = interaction.options.getString('argument').toLowerCase() ?? "No Argument";

        switch (sub) {
            case "sfw":
                if (args == "megumin") {
                    return await interaction.reply("Oh hell nah, this man tried to get Megumin images 💀💀");
                } else {
                    axios
                        .get('https://api.waifu.pics/sfw/' + args)
                        .then(async response => {
                            console.log(`statusCode: ${response.status}`)
                            console.log(response['data'].url)

                            const embed = new EmbedBuilder()
                                .setTitle(`Requested by: ${interaction.user.username}#${interaction.user.discriminator}` + " " + args)
                                .setColor("#34ebcf")
                                .setImage(response['data'].url)
                                .setFooter({ text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
                            return await interaction.reply({ embeds: [embed] });
                        })
                        .catch(error => {
                            console.error(error)
                        })
                }
                break;
            case "nsfw":
                if (interaction.channel.nsfw) {
                    if (args == "megumin") {
                        return await interaction.reply(
                            "Oh hell nah, this man tried to get Megumin images 💀💀"
                        );
                    } else {
                        axios
                            .get("https://api.waifu.pics/nsfw/" + args)
                            .then(async (response) => {
                                console.log(`statusCode: ${response.status}`);
                                console.log(response["data"].url);

                                const embed = new EmbedBuilder()
                                    .setTitle(args)
                                    .setColor("#34ebcf")
                                    .setImage(response["data"].url)
                                    .setFooter({
                                        text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`,
                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                                    });
                                return await interaction.reply({ embeds: [embed] });
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                } else {
                    await interaction.reply("Can only be used in NSFW channels.");
                }
                break;
        }
    }
}