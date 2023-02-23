const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('token')
        .setDescription('Bot token for free :D!'),
    async execute(interaction) {

        const embed = new EmbedBuilder();


        fetch(`https://some-random-api.ml/bottoken?id=${interaction.user.id}`)
            .then((res) => res.json().catch({}))
            .then(async (json) => {
                embed.setTitle("🤖・Bot token").setDescription(`${json.token}`).setColor("LuminousVividPink");
                return interaction.reply({ embeds: [embed] })
            }).catch({})





    },
};