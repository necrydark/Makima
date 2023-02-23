const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Levels = require('discord.js-leveling');
const Functions = require('../../schemas/functions');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-reset')
        .setDescription('Resets users ranks')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Enter user level to be reset")),
    async execute(interaction) {
        const { guildId, options, user } = interaction;

        const member = options.getMember("user") || user;

        const data = await Functions.findOne({ GuildID: interaction.guild.id });

        if (data && data.Levels == true) {

            Levels.resetUserXP(member.id, guildId);
            const embed = new EmbedBuilder();


            embed.setColor('Random')
                .setDescription(`Reset ${member} XP`)
                .setTimestamp()
                .setFooter({ text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });


            return interaction.reply({ embeds: [embed] });
        } else {
            interaction.reply({ content: 'Levels are not enabled in this guild!', ephemeral: true })
        }
    },
};