const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');
// const { PermissionsBitField } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutes the user you want!')

        .addUserOption(option => option.setName('target').setDescription('User you want to mute').setRequired(true))
        .addStringOption(option =>
            option.setName('time')
                .setDescription('How long should the mute last [s, h, d]')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason as to why user needs to be muted')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const { guild, options, user } = interaction;

        const users = options.getUser('target') || user;
        const member = guild.members.cache.get(users.id);
        const time = options.getString('time');
        const convertedTime = ms(time);
        const reason = options.getString('reason') || "No reason provided";

        const errEmbed = new EmbedBuilder()
            .setDescription(`Can't timeout ${member.tag}.`)
            .setColor('DarkRed')

        const succesEmbed = new EmbedBuilder()
            .setTitle("**:white_check_mark: Muted**")
            .setDescription(`Succesfully muted ${member.tag}.`)
            .addFields(
                { name: "Reason", value: `${reason}`, inline: true },
                { name: "Duration", value: `${time}`, inline: true }
            )
            .setColor(0x5fb041)
            .setTimestamp();

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true }); // this if statement is optional (but recommended)

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        if (!convertedTime)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        try {
            await member.timeout(convertedTime, reason);

            interaction.reply({ embeds: [succesEmbed], ephemeral: true });
        } catch (err) {
            console.log(err);
        }
    },
};