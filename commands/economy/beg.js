const { SlashCommandBuilder, time, EmbedBuilder } = require("discord.js");
const economyTimeout = require("../../schemas/economyTimeout");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('beg')
    .setDescription('Beg for coins!'),
    async execute(interaction, client) {
        let user = interaction.user;
        let timeout = 180000;
        let amount = 5;
        const embed = new EmbedBuilder();

        economyTimeout.findOne({GuildID: interaction.guild.id, User: user.id}, async (err, dataTime) => {
            if(dataTime && dataTime !== null && timeout - (Date.now() - dataTime.Beg) > 0) {
                let time = (dataTime.Beg / 1000 + timeout / 1000).toFixed(0);
                embed.setDescription(time);
                await interaction.reply({embeds: [embed]});
            } else {

                if(dataTime) {
                    dataTime.Beg = Date.now();
                    dataTime.save();
                } else {
                    new economyTimeout({
                        GuildID: interaction.guild.id,
                        User: user.id,
                        Beg: Date.now()
                    });
                }
                embed.setColor('Green')
                .setTitle('You begged for some coins!')
                .addFields(
                    {name: 'Amount Gained', value: `${amount}`, inline: true}
                );
                interaction.reply({embeds: [embed]});

                client.addMoney(interaction, user, amount)
            }
        })
    }
}