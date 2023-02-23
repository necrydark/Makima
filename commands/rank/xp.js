const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Levels = require('discord.js-leveling');
const Functions = require('../../schemas/functions');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription('Adjusts a users XP')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand.setName("add")
                .setDescription("Add xp to a user")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription('Select a user')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("amount")
                        .setDescription("Amount of XP")
                        .setMinValue(0)
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand.setName("remove")
                .setDescription("Remove xp from a user")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription('Select a user')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("amount")
                        .setDescription("Amount of XP")
                        .setMinValue(0)
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand.setName("set")
                .setDescription("Set a users XP")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription('Select a user')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("amount")
                        .setDescription("Amount of XP")
                        .setMinValue(0)
                        .setRequired(true))
        ),
    async execute(interaction) {
        const { options, guildId } = interaction;

        const sub = options.getSubcommand();
        const target = options.getUser("target");
        const amount = options.getInteger("amount");
        const embed = new EmbedBuilder();

        const data = await Functions.findOne({ GuildID: guildId });


        if (data && data.Levels == true) {
            try {
                switch (sub) {
                    case "add":
                        await Levels.appendXp(target.id, guildId, amount);
                        embed.setDescription(`Added ${amount} xp to ${target}.`).setColor("Green").setTimestamp();
                        break;
                    case "remove":
                        await Levels.subtractXp(target.id, guildId, amount);
                        embed.setDescription(`Removed ${amount} xp from ${target}.`).setColor("Green").setTimestamp();
                        break;

                    case "set":
                        await Levels.setXp(target.id, guildId, amount);
                        embed.setDescription(`Set ${target}'s xp to ${amount}.`).setColor("Green").setTimestamp();
                        break;

                }
            } catch (err) {
                console.log(err);
            }

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            interaction.reply({ content: 'Levels are not enabled in this guild!', ephemeral: true })
        }

    },
};