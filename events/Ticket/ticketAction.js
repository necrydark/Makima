const { createTranscript } = require('discord-html-transcripts');
const { ButtonInteraction, EmbedBuilder, PermissionFlagsBits, Guild } = require('discord.js');
// require('dotenv').config();
const ticketSetup = require('../../schemas/ticketsetup');
const ticketSchema = require('../../schemas/ticket');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        const { guild, member, customId, channel } = interaction;
        const { ManageChannels, SendMessages } = PermissionFlagsBits;

        if (!interaction.isButton()) return;

        if (!['close', 'lock', 'unlock', 'claim'].includes(customId)) return;

        const docs = await ticketSetup.findOne({ GuildID: guild.id });

        if (!docs)
            return;

        if (!guild.members.me.permissions.has((r) => r.id === docs.Handlers))
            return interaction.reply({ content: "I don't have permissions for this!", ephemeral: true })

        const embed = new EmbedBuilder().setColor('Aqua');

        ticketSchema.findOne({ ChannelID: channel.id }, async (err, data) => {
            if (err) throw err;
            if (!data) return;

            const fetchedMember = await guild.members.cache.get(data.MembersID);
            const fetchedChannel = await guild.channels.cache.get(data.ChannelID);
            switch (customId) {
                case "close":
                    if (data.Closed == true)
                        return interaction.reply({ content: "Ticket is already getting deleted.", ephemeral: true })
                    const createdTranscript = await createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${member.user.username}-ticket${data.Type}-${data.TicketID}.html`,
                    });

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Closed: true });

                    const transcriptEmbed = new EmbedBuilder()
                        .setTitle(`Transcript type: ${data.Type}\nID: ${data.TicketID}`)
                        .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp();


                    const transcriptProcess = new EmbedBuilder()
                        .setTitle('Saving transcript')
                        .setDescription('Ticket will be closed in 10 seconds, enable DMs for ticket transcripts.')
                        .setColor('Red')
                        .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp();

                    const res = await guild.channels.cache.get(docs.Transcripts).send({
                        embeds: [transcriptEmbed],
                        files: [createdTranscript]
                    })

                    channel.send({ embeds: [transcriptProcess] });

                    setTimeout(function () {
                        fetchedMember.send({
                            embeds: [transcriptEmbed.setDescription(`Access your transcript: ${res.url}`)]
                        }).catch(() => channel.send('Couldn\'t send transcript to DMs'));
                        channel.delete()
                    }, 10000);

                    break;
                case "lock":
                    if (!member.permissions.has(ManageChannels))
                        return interaction.reply({ content: "Cannot lock the ticket", ephemeral: true })

                    if (data.Locked == true)
                        return interaction.reply({ content: "Ticket is already locked", ephemeral: true });

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Locked: true });
                    embed.setDescription("Ticket was locked 🔒");


                    data.MembersID.map((m) => {
                        channel.permissionOverwrites.edit
                            (m, { SendMessages: false });
                    })
                    return interaction.reply({ embeds: [embed] });

                case "unlock":
                    if (!member.permissions.has(ManageChannels))
                        return interaction.reply({ content: "Cannot lock the ticket", ephemeral: true })

                    if (data.Locked == false)
                        return interaction.reply({ content: "Ticket is already locked", ephemeral: true });

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Locked: false });
                    embed.setDescription("Ticket was unlocked 🔓");

                    data.MembersID.map((m) => {
                        channel.permissionOverwrites.edit
                            (m, { SendMessages: true });
                    })
                    return interaction.reply({ embeds: [embed] });

                case "claim":
                    if (!member.permissions.has(ManageChannels))
                        return interaction.reply({ content: "Cannot claim the ticket", ephemeral: true })

                    if (data.Claimed == true)
                        return interaction.reply({ content: `Ticket is already claimed by <@${data.ClaimedBy}>`, ephemeral: true })

                    await ticketSchema.updateOne({ ChannelID: channel.id },
                        {
                            Claimed: true,
                            ClaimedBy: member.id,
                        });

                    embed.setDescription(`Ticket was succesfully claimed by ${member}`);

                    interaction.reply({ embeds: [embed], ephemeral: true })

                    break;

            }
        })
    }
}