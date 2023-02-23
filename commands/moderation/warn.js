const { SlashCommandBuilder } = require('@discordjs/builders');
const warningSchema = require("../../schemas/warn-schema");
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user')
        .addSubcommand(subcommand =>
            subcommand.setName("add")
                .setDescription("Add a warning to a user")
                .addUserOption(option =>
                    option.setName('target').
                        setDescription('User you want to warn').
                        setRequired(true))
                .addStringOption(option =>
                    option.setName("reason")
                        .setDescription("Reason to why user is being warned")
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand.setName("check")
                .setDescription("Check warnings of a user")
                .addUserOption(option =>
                    option.setName('target').
                        setDescription('User you want to warn').
                        setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("remove")
                .setDescription("Remove a specific warning")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("Select a user.")
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("id")
                        .setDescription("Provide the warning's ID")
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("clear")
                .setDescription("Clear all warnings from a user.")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("Selects a user")
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const { options, guildId, user, member } = interaction;
        const sub = options.getSubcommand(["add", "check", "remove", "clear"]);
        const target = options.getUser("target");
        const reason = options.getString("reason") || "No reason provided";
        const warnId = options.getInteger("id") - 1;
        const warnDate = new Date(interaction.createdTimestamp).toLocaleDateString();

        const userTag = `${target.username}#${target.discriminator}`;

        const embed = new EmbedBuilder();

        switch (sub) {
            case "add":
                warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag }, async (err, data) => {
                    if (err) throw err;

                    if (!data) {
                        data = new warningSchema({
                            GuildID: guildId,
                            UserID: target.id,
                            UserTag: userTag,
                            Content: [
                                {
                                    ExectuerId: user.id,
                                    ExectuerTag: user.tag,
                                    Reason: reason,
                                    Date: warnDate
                                }
                            ],
                        });
                    } else {
                        const warnContent = {
                            ExectuerId: user.id,
                            ExectuerTag: user.tag,
                            Reason: reason,
                            Date: warnDate
                        }
                        data.Content.push(warnContent);
                    }
                    data.save();
                });

                embed.setColor('Green')
                    .setDescription(`
                Warning Added: ${userTag} | ||${target.id}||
                **Reason**: ${reason}`)
                    .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();
                interaction.reply({ embeds: [embed] });
                break;
            case "check":
                warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag }, async (err, data) => {
                    if (err) throw err;

                    if (data) {
                        embed.setColor('Green')
                            .setDescription(`${data.Content.map((w, i) => `**ID**: ${i + 1}
                            **By**: ${w.ExectuerTag}
                            **Date**: ${w.Date}
                            **Reason**: ${w.Reason}\n\n
                            `
                            ).join(" ")}`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();
                        interaction.reply({ embeds: [embed] });
                    } else {
                        embed.setColor('Red')
                            .setDescription(`${userTag}| ||${target.id}|| has no warnings.`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();
                        interaction.reply({ embeds: [embed] });
                    }
                });
                break;
            case "remove":
                warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag }, async (err, data) => {
                    if (err) throw err;

                    if (data) {
                        await warningSchema.findOneAndDelete({ GuildID: guildId, UserID: target.id, UserTag: userTag });

                        embed.setColor('Green')
                            .setDescription(`${userTag}'s warning id: ${warnId + 1} has been removed.`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();
                        interaction.reply({ embeds: [embed] });
                    } else {
                        embed.setColor('Red')
                            .setDescription(`${userTag}| ||${target.id}|| has no warnings.`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();
                        interaction.reply({ embeds: [embed] });
                    }
                });
                break;
            case "clear":
                warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag }, async (err, data) => {
                    if (err) throw err;

                    if (data) {
                        warningSchema.findOneAndDelete({ GuildID: guildId, UserID: target.id, UserTag: userTag });


                        embed.setColor('Green')
                            .setDescription(`${userTag}'s warnings have been cleared. | ||${target.id}||`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();
                        interaction.reply({ embeds: [embed] });
                    } else {
                        embed.setColor('Red')
                            .setDescription(`${userTag}| ||${target.id}|| has no warnings.`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();
                        interaction.reply({ embeds: [embed] });
                    }
                });
                break;
        }

    },
};