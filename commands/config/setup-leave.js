const { Message, Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const leaveSchema = require("../../schemas/leave-schema");
const { model, Schema } = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup-leave")
        .setDescription("Set up your leave message for the discord bot.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Channel for leave messages.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("leave-message")
                .setDescription("Enter your leave message.")
                .setRequired(true)
        )

        .addStringOption(option =>
            option.setName("leave-image")
                .setDescription("Enter your leave image (URL ONLY).")
                .setRequired(false)
        ),

    async execute(interaction) {
        const { channel, options, guildId } = interaction;

        const leaveChannel = options.getChannel("channel");
        const leaveMessage = options.getString("leave-message");
        const leaveImage = options.getString("leave-image")

        const embed = new EmbedBuilder();


        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            interaction.reply({ content: "I don't have permissions for this.", ephemeral: true });
        }

        if (leaveImage) {
            leaveSchema.findOne({ GuildID: guildId }, async (err, data) => {
                if (!data) {
                    await leaveSchema.create({
                        GuildID: guildId,
                        Channel: leaveChannel.id,
                        Msg: leaveMessage,
                        URL: leaveImage,
                    });
                    embed.setDescription("Data was succesfully sent to the database.")
                        .setColor("Green")
                        .setTimestamp();
                } else {
                    await leaveSchema.findOneAndUpdate({ GuildID: guildId });
                    await leaveSchema.create({
                        GuildID: guildId,
                        Channel: leaveChannel.id,
                        Msg: leaveMessage,
                        URL: leaveImage,
                    });

                    embed.setDescription("Old data was succesfully replaced with the new data.")
                        .setColor("Green")
                        .setTimestamp();
                }
                if (err) {
                    embed.setDescription("Something went wrong. Please contact the developers")
                        .setColor("Red")
                        .setTimestamp();
                }
                return interaction.reply({ embeds: [embed], ephemeral: true });
            })
        } else {
            leaveSchema.findOne({ GuildID: guildId }, async (err, data) => {
                if (!data) {
                    await leaveSchema.create({
                        GuildID: guildId,
                        Channel: leaveChannel.id,
                        Msg: leaveMessage,

                    });
                    embed.setDescription("Data was succesfully sent to the database.")
                        .setColor("Green")
                        .setTimestamp();
                } else {
                    await leaveSchema.findOneAndUpdate({ GuildID: guildId });
                    await leaveSchema.create({
                        GuildID: guildId,
                        Channel: leaveChannel.id,
                        Msg: leaveMessage,

                    });

                    embed.setDescription("Old data was succesfully replaced with the new data.")
                        .setColor("Green")
                        .setTimestamp();
                }
                if (err) {
                    embed.setDescription("Something went wrong. Please contact the developers")
                        .setColor("Red")
                        .setTimestamp();
                }
                return interaction.reply({ embeds: [embed], ephemeral: true });
            })
        }


    }
}