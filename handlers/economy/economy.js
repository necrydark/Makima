const { EmbedBuilder } = require("discord.js");
const economy = require("../../schemas/economy");
const economyItems = require("../../schemas/economyItems");



module.exports = async(client) => {
    const embed = new EmbedBuilder();

    client.addMoney = async function(interaction, user, amount) {
        economy.findOne({ GuildID: interaction.guild.id, User: user.id}, async (err,data) => {
            if(data) {
                data.Money += amount;
                data.save();
            } else {
                new economy({
                    GuildID: interaction.guild.id,
                    User: user.id,
                    Money: amount,
                    Bank: 0
                }).save();
            }
        })
    }

    client.removeMoney = async function(interaction, user, amount) {
        economy.findOne({ GuildID: interaction.guild.id, User: user.id}, async (err,data) => {
            if(data) {
                data.Money -= amount;
                data.save();
            } else {
                embed.setDescription(`User has no coins!`);
                interaction.reply({embeds: [embed]})
            }
        })
    }


    client.buyItem = async function(interaction, user,item) {
        const data = await economyItems.findOne({GuildID: interaction.guild.id, User: user.id});

        if(item == "FishingRod") {
            if(data) {
                data.FishingRod = true;
                data.save();
            }
            else {
                new economyItems({
                    Guild: interaction.guild.id,
                    User: user.id,
                    FishingRod: true,
                }).save();
            }
        }
    }
}