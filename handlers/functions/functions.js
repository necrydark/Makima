const discord = require('discord.js');
const fetch = require('node-fetch');

const Function = require('../../schemas/functions');

module.exports = async (client) => {

    client.generateEmbed = async function (start, end, lb, title, interaction) {
        const current = lb.slice(start, end + 10);
        const result = current.join("\n");

        let embed = client.templateEmbed()
            .setTitle(`${title}`)
            .setDescription(`${result.toString()}`)
            .setFooter({
                text: `Requested by: ${client.user.username}#${client.user.discriminator}`,
                iconURL: client.user.displayAvatarURL({ dynamic: true, size: 1024 })
            });


        return embed;
    }

    client.createLeaderboard = async function (title, lb, interaction) {
        interaction.reply({ embeds: [await client.generateEmbed(0, 0, lb, title, interaction)], fetchReply: true }).then(async msg => {
            if (lb.length <= 10) return;

            let button1 = new discord.ButtonBuilder()
                .setCustomId('back_button')
                .setEmoji('⬅️')
                .setStyle(discord.ButtonStyle.Primary)
                .setDisabled(true);

            let button2 = new discord.ButtonBuilder()
                .setCustomId('forward_button')
                .setEmoji('➡️')
                .setStyle(discord.ButtonStyle.Primary);

            let row = new discord.ActionRowBuilder()
                .addComponents(button1, button2);

            msg.edit({ embeds: [await client.generateEmbed(0, 0, lb, title, interaction)], components: [row] })

            let currentIndex = 0;
            const collector = interaction.channel.createMessageComponentCollector({ componentType: discord.ComponentType.Button, time: 60000 });

            collector.on('collect', async (btn) => {
                if (btn.user.id == interaction.user.id && btn.message.id == msg.id) {
                    btn.customId === "back_button" ? currentIndex -= 10 : currentIndex += 10;

                    let btn1 = new discord.ButtonBuilder()
                        .setCustomId('back_button')
                        .setEmoji('⬅️')
                        .setStyle(discord.ButtonStyle.Primary)
                        .setDisabled(true);

                    let btn2 = new discord.ButtonBuilder()
                        .setCustomId('forward_button')
                        .setEmoji('➡️')
                        .setStyle(discord.ButtonStyle.Primary)
                        .setDisabled(true);

                    if (currentIndex !== 0) btn1.setDisabled(false);
                    if (currentIndex + 10 < lb.length) btn2.setDisabled(false);

                    let row2 = new discord.ActionRowBuilder()
                        .addComponents(btn1, btn2);

                    msg.edit({ embeds: [await client.generateEmbed(currentIndex, currentIndex, lb, title, interaction)], components: [row2] });
                    btn.deferUpdate();
                }
            })

            collector.on('end', async (btn) => {
                let btn1Disable = new discord.ButtonBuilder()
                    .setCustomId('back_button')
                    .setEmoji('⬅️')
                    .setStyle(discord.ButtonStyle.Primary)
                    .setDisabled(true);

                let btn2Disable = new discord.ButtonBuilder()
                    .setCustomId('forward_button')
                    .setEmoji('➡️')
                    .setStyle(discord.ButtonStyle.Primary)
                    .setDisabled(true);

                let rowDisable = new discord.ActionRowBuilder()
                    .addComponents(btn1Disable, btn2Disable);

                msg.edit({ embeds: [await client.generateEmbed(currentIndex, currentIndex, lb, title, interaction)], components: [rowDisable] });
            })
        })
    }
}