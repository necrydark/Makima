const { Message, Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const welcomeSchema = require("../../schemas/welcome-schema");
const { model, Schema } = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup-welcome")
        .setDescription("Set up your welcome message for the discord bot.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Channel for welcome messages.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("welcome-message")
                .setDescription("Enter your welcome message.")
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName("welcome-role")
                .setDescription("Enter your welcome role.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("welcome-image")
                .setDescription("Enter your welcome image (URL ONLY).")
                .setRequired(false)
        ),

    async execute(interaction) {
        const { channel, options, guildId } = interaction;

        const welcomeChannel = options.getChannel("channel");
        const welcomeMessage = options.getString("welcome-message");
        const roleId = options.getRole("welcome-role");
        const welcomeImage = options.getString("welcome-image")

        const embed = new EmbedBuilder();


        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            interaction.reply({ content: "I don't have permissions for this.", ephemeral: true });
        }

        if (welcomeImage) {
            welcomeSchema.findOne({ Guild: guildId }, async (err, data) => {
                if (!data) {
                    await welcomeSchema.create({
                        Guild: guildId,
                        Channel: welcomeChannel.id,
                        Msg: welcomeMessage,
                        Role: roleId.id,
                        URL: welcomeImage,
                    });
                    embed.setDescription("Data was succesfully sent to the database.")
                        .setColor("Green")
                        .setTimestamp();
                } else {
                    await welcomeSchema.findOneAndUpdate({ Guild: guildId });
                    await welcomeSchema.create({
                        Guild: guildId,
                        Channel: welcomeChannel.id,
                        Msg: welcomeMessage,
                        Role: roleId.id,
                        URL: welcomeImage,
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
            welcomeSchema.findOne({ Guild: guildId }, async (err, data) => {
                if (!data) {
                    await welcomeSchema.create({
                        Guild: guildId,
                        Channel: welcomeChannel.id,
                        Msg: welcomeMessage,
                        Role: roleId.id,
                    });
                    embed.setDescription("Data was succesfully sent to the database.")
                        .setColor("Green")
                        .setTimestamp();
                } else {
                    await welcomeSchema.findOneAndUpdate({ Guild: guildId });
                    await welcomeSchema.create({
                        Guild: guildId,
                        Channel: welcomeChannel.id,
                        Msg: welcomeMessage,
                        Role: roleId.id,
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