const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Levels = require('discord.js-leveling');
const Functions = require('../../schemas/functions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows leaderboard for guild!'),
    async execute(interaction, client) {
        const { guildId } = interaction;
        const embed = new EmbedBuilder();


        const data = await Functions.findOne({ GuildID: guildId });

        if (data && data.Levels == true) {
            const rawLeaderboard = await Levels.fetchLeaderboard(guildId, 10);

            if (rawLeaderboard.length < 1) return interaction.reply("Nobody is in the leaderboard")

            const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);

            // const lb = leaderboard.map(e =>
            //     `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`);

            const lb = leaderboard.map(e => `**${e.position}.** ${e.username}#${e.discriminator}\n**Level:** ${e.level}\n**XP:** ${e.xp.toLocaleString()}`);


            embed.setColor('Random')
                .setDescription(lb.join("\n\n"))
                .setTimestamp()
                .setFooter({ text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

            // message.channel.send(`**Leaderboard**:\n\n${lb.join("\n\n")}`);
            return interaction.reply({ embeds: [embed] });
        } else {
            interaction.reply({ content: 'Levels are not enabled in this guild!', ephemeral: true })

        }

    },
};