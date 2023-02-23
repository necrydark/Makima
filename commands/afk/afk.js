const afkSchema = require('../../schemas/afk');
const wait = require('node:timers/promises').setTimeout
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set yourself AFK or check who is afk!')
        .addSubcommand(command =>
            command.setName('set')
                .setDescription('Set yourself AFK!')
                .addStringOption(option =>
                    option
                        .setName('reason')
                        .setDescription('The reason why you are afk')
                        .setRequired(false)))
        .addSubcommand(command =>
            command.setName('list')
                .setDescription('List all the data')),
    async execute(interaction, client) {
        const { options } = interaction;
        const sub = options.getSubcommand(["set", "list"]);
        const reason = options.getString('reason') || 'Not specified'

        switch (sub) {
            case 'set':
                afkSchema.findOne({ GuildID: interaction.guild.id, User: interaction.user.id }, async (err, data) => {
                    if (data) {
                        return client.errNormal({
                            error: `You're already afk!`,
                            type: 'editreply'
                        }, interaction);
                    } else {
                        await
                            new afkSchema({
                                GuildID: interaction.guild.id,
                                User: interaction.user.id,
                                Message: reason
                            }).save();

                        if (!interaction.member.displayName.includes(`[AFK]`)) {
                            interaction.member.setNickname(`[AFK]` + interaction.member.displayName).catch(e => { });
                        }

                        client.succNormal({
                            text: `You are AFK!`,
                            type: 'ephemeraledit'
                        }, interaction)

                        client.embed({
                            desc: `${interaction.user} is now AFK! **Reason:** ${reason}`
                        }, interaction.channel)
                    }
                })
                break;
            case 'list':
                const rawboard = await afkSchema.findOne({ GuildID: interaction.guild.id });

                if (rawboard.length < 1) await client.errNormal({
                    error: 'No data found',
                    type: 'editreply'
                }, interaction);

                const lb = rawboard.map(e => `<@!${e.User}> - **Reason** ${e.Message}`);
                // await client.createLeaderboard(`🚫・AFK users - ${interaction.guild.name}`, lb, interaction);
                const embed = new EmbedBuilder()
                    .setTitle("AFK")
                    .setDescription(lb);
                interaction.reply({ embeds: [embed] });
                break;
        }
    },
};