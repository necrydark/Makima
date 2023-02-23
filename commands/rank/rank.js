const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Levels = require('discord.js-leveling');
const canvacord = require('canvacord');
const Functions = require('../../schemas/functions');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Shows rank of user!')
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user you want to check the rank of")),
    async execute(interaction) {
        const { options, user, guild } = interaction;

        const Member = options.getMember("user") || user;

        const member = guild.members.cache.get(Member.id)

        const data = await Functions.findOne({ GuildID: guild.id });

        if (data && data.Levels == true) {
            const levelUser = await Levels.fetch(member.id, guild.id, true);
            const neededXp = Levels.xpFor(parseInt(levelUser.level) + 1);
            // const embed = new EmbedBuilder();
            if (!levelUser) return interaction.reply({ content: "Seems like the user hasn't gained any XP yet.", ephemeral: true });


            const rank = new canvacord.Rank()
                .setAvatar(member.displayAvatarURL({
                    format: 'png',
                    dynamic: true
                }))
                .setCurrentXP(levelUser.xp)
                .setRequiredXP(neededXp)
                .setRank(levelUser.position)
                .setLevel(levelUser.level)
                .setProgressBar('#b41a1e', "COLOR", true)
                .setProgressBarTrack('#583635')
                .setUsername(`${member.user.username}`)
                .setDiscriminator(`${member.user.discriminator}`);
            rank.build()
                .then(data => {
                    const attachment = new AttachmentBuilder(data, { name: "RankCard.png" });
                    interaction.reply({ files: [attachment] });
                })
        } else {
            interaction.reply({ content: 'Levels are not enabled in this guild!', ephemeral: true })
        }
        // embed.setDescription(`**${user.username}#${user.discriminator}** is currently level ${levelUser.level} and has ${levelUser.xp.toLocaleString()} xp`)
        //     .setColor("Random").setTimestamp();

        // return interaction.reply({ embeds: [embed] });
    },
};