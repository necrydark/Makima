const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const blacklistSchema = require('../../schemas/blacklistSchema')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Blacklist a word or remove it!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('Blacklist a word.')
                .addStringOption(option =>
                    option.setName('word')
                        .setDescription('Word you want to blacklist')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('remove a word.')
                .addStringOption(option =>
                    option.setName('word')
                        .setDescription('Word you want to remove')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('clear')
                .setDescription('Clear the automod'))
        .addSubcommand(subcommand =>
            subcommand.setName('display')
                .setDescription('Displays all blacklisted words.')),
    async execute(interaction, client) {
        const { options, guildId } = interaction;
        const sub = options.getSubcommand(['add', 'remove', 'clear', 'display']);
        const word = options.getString("word");
        const embed = new EmbedBuilder();


        // if (data) {
        //     if (data.Words.includes(word)) {
        //         embed.setTitle("Error").setDescription('That word is already exists in the database!');
        //         interaction.reply({ embeds: [embed] });

        //         data.Words.push(word);
        //         data.save();
        //     } else {
        //         new blacklistSchema({
        //             GuildID: guildId,
        //             Words: word
        //         })
        //     }
        //     embed.setTitle("Saved").setDescription(`✅ ${word} has been added to the database!`);
        //     return await interaction.reply({ embeds: [embed] });
        // })

        switch (sub) {
            case "add":
                blacklistSchema.findOne({ GuildID: guildId }, async (err, data) => {
                    if (err) throw err;
                    if (data) {
                        if (data.Words.includes(word)) {
                            embed.setTitle("Error").setDescription('That word is already exists in the database!');
                            interaction.reply({ embeds: [embed] });
                        }
                        if (!data.Words) data.Words = [];
                        data.Words.push(word);
                        data.save();
                    }
                    else {
                        new blacklistSchema({
                            GuildID: guildId,
                            Words: word
                        }).save();
                    }
                })
                embed.setTitle("Saved").setDescription(`✅ ${word} has been added to the database!`);
                client.succNormal({
                    text: `Word added to blacklist`,
                    fields: [
                        {
                            name: "Word",
                            value: `${word}`
                        }
                    ],
                    type: 'reply'
                }, interaction)
                break;
            case "remove":
                blacklistSchema.findOne({ GuildID: guildId }, async (err, data) => {
                    if (data) {
                        if (!data.Words.includes(word)) {
                            embed.setTitle("Error").setDescription("That word doesn't exist in the database!");
                            interaction.reply({ embeds: [embed] });
                        }
                        const filtered = data.Words.filter((target) => target !== word);

                        await blacklistSchema.findOneAndUpdate({ GuildID: guildId }, {
                            GuildID: guildId,
                            Words: filtered
                        });
                        embed.setTitle("Removed").setDescription(`✅ ${word} has been removed from the database!`);
                        return interaction.reply({ embeds: [embed] });


                    } else {
                        embed.setTitle("Error").setDescription(`The guild has no data!`);
                        return await interaction.reply({ embeds: [embed] });

                    }
                })
                break;
            case "clear":
                blacklistSchema.findOneAndDelete({ GuildID: guildId }, async (err) => {
                    if (err) {
                        embed.setColor('Red')
                            .setDescription(`Cannot clear.`)
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();
                    } else {
                        embed.setColor('Green')
                            .setDescription(`The blacklist has been cleared by ${interaction.user.tag}`)
                            .setFooter({ text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();
                    }
                    return await interaction.reply({ embeds: [embed] });

                })
                // blacklistSchema.findOne({ GuildID: guildId }, async (err, data) => {
                //     if (err) throw err;

                //     if (data) {
                //         blacklistSchema.findOneAndDelete({ GuildID: guildId });
                //         embed.setColor('Green')
                //             .setDescription(`The blacklist has been cleared by ${interaction.user.tag}`)
                //             .setFooter({ text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                //             .setTimestamp();
                //     } else {
                //         embed.setColor('Red')
                //             .setDescription(`Cannot clear.`)
                //             .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                //             .setTimestamp();
                //     }
                //     return await interaction.reply({ embeds: [embed] });

                // })
                break;
            case "display":
                blacklistSchema.findOne({ GuildID: guildId }, async (err, data) => {
                    if (data && data.Words.length > 0) {
                        embed.setTitle("🤬・Blacklisted words").setDescription(data.Words.join(" "));
                        return interaction.reply({ embeds: [embed] });
                    } else {
                        embed.setTitle("Error").setDescription(`The guild has no data!`);
                        return await interaction.reply({ embeds: [embed] });
                    }
                })
                break;
        }

    },
};



