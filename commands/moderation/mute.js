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
        const { guild, options } = interaction;

        const user = options.getUser('target');
        const member = guild.members.cache.get(user.id);
        const time = options.getString('time');
        const convertedTime = ms(time);
        const reason = options.getString('reason') || "No reason provided";

        const errEmbed = new EmbedBuilder()
            .setDescription('Something went wrong.')
            .setColor('DarkRed')

        const succesEmbed = new EmbedBuilder()
            .setTitle("**:white_check_mark: Muted**")
            .setDescription(`Succesfully muted ${user}.`)
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
        // const logChannel = interaction.guild.channels.cache.find(ch => ch.name === "logged-users");
        // const target = interaction.options.getMember('target')
        // const reason = interaction.options.getString('reason');
        // let role = interaction.guild.roles.cache.find(r => r.name === 'muted')

        // if (!target) await interaction.reply('You need to add a target!');
        // if (!role) await interaction.reply('You need to create a role called muted');
        // if (!logChannel) return (`Channel does not exist! Please create a channel with the name "logged-users"`);



        // if (target.roles.cache.some(r => r.name === 'muted')) {
        //     await interaction.reply("User is already muted!");
        // } else {
        //     if (role) {
        //         if (target && !reason) {
        //             const embed = new EmbedBuilder()
        //                 .setColor('Red')
        //                 .setDescription(`✅ ${target} has been muted by ${interaction.user}`);
        //             target.roles.add(role);
        //             logChannel.send({ embeds: [embed] });
        //             await interaction.reply({ embeds: [embed] });

        //         } else {
        //             const embed = new EmbedBuilder()
        //                 .setColor('Red')
        //                 .setDescription(`✅ ${target} has been muted for ${reason} by ${interaction.user}`);
        //             target.roles.add(role);
        //             logChannel.send({ embeds: [embed] });
        //             await interaction.reply({ embeds: [embed] });
        //         }
        //     }

        // }


    },
};