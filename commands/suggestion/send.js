const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder } = require("discord.js");
const suggestionChannel = require("../../schemas/suggestionChannel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Send a suggestion!')
        .addStringOption(option =>
            option.setName('suggestion')
                .setDescription('The suggestion you want to send!')
                .setRequired(true)),
    /**
  * 
  * @param {CommandInteraction} interaction 
  * @param {Client} client 
  */
    async execute(interaction, client) {
        const { options, guild, channel } = interaction;
        const suggestionQuery = options.getString('suggestion');

        const data = suggestionChannel.findOne({ GuildID: interaction.guild.id });
        if (data) {
            const Channel = guild.channels.cache.get('1069032525160259594');
            if (!Channel) return client.errNormal({
                error: `Suggestion channel not found!`,
                type: 'reply'
            }, interaction);

            if (Channel.id !== channel.id) return client.errNormal({
                error: `Please use this command in <#${Channel.id}>`,
                type: 'reply'
            }, interaction);

            const embed = new EmbedBuilder()
                .setTitle(`💡 Suggestion`)
                .setDescription(`${suggestionQuery}`)
                .setFooter({ text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();


            await interaction.reply({ embeds: [embed] });

            // client.embed({
            //     title: `💡 Suggestion`,
            //     desc: `${suggestionQuery}`,
            //     author: {
            //         name: interaction.user.tag,
            //         iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 1024 })
            //     },
            //     footer: {
            //         text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`,
            //         iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            //     }
            // }, channel).then((msg) => {
            //     client.succNormal({
            //         text: `Suggestion submitted!`,
            //         fields: [
            //             {
            //                 name: `💬 Suggestion`,
            //                 value: `${suggestionQuery}`,
            //                 inline: true,
            //             },
            //             {
            //                 name: `📕 Channel`,
            //                 value: `<#${data.Channel}>`,
            //                 inline: true
            //             }
            //         ],
            //         type: 'reply'
            //     }, interaction);

            //     msg.react(client.emotes.normal.arrowUp);
            //     msg.react(client.emotes.normal.arrowDown);
            // }).catch((e) => {
            //     // return client.errNormal({
            //     //     error: `${e}`,
            //     //     type: 'reply'
            //     // }, interaction)
            //     console.log(e);
            // })
        } else {

            client.errNormal({
                error: `No suggestion channel set! Please do the setup`,
                type: 'reply'
            }, interaction);

        }
        // const data = await suggestionChannel.findOne({ GuildID: interaction.guild.id });
        // console.log(data);
        // if (data) {
        //     const channel = interaction.guild.channels.cache.get(data.Channel);
        //     console.log(channel)
        //     client.embed({
        //         title: `💡 Suggestion`,
        //         desc: `${suggestionQuery}`,
        //         author: {
        //             name: interaction.user.tag,
        //             iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 1024 })
        //         },
        //         footer: {
        //             text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`,
        //             iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        //         }
        //     }, channel).then((msg) => {
        //         client.succNormal({
        //             text: `Suggestion submitted!`,
        //             fields: [
        //                 {
        //                     name: `💬 Suggestion`,
        //                     value: `${suggestionQuery}`,
        //                     inline: true,
        //                 },
        //                 {
        //                     name: `📕 Channel`,
        //                     value: `<#${data.Channel}>`,
        //                     inline: true
        //                 }
        //             ],
        //             type: 'reply'
        //         }, interaction);

        //         msg.react(client.emotes.normal.arrowUp);
        //         msg.react(client.emotes.normal.arrowDown);
        //     }).catch((e) => {
        //         return client.errNormal({
        //             error: `No suggestion channel set. Please setup a channel!`,
        //             type: 'reply'
        //         }, interaction)
        //     })
        // } else {
        //     client.errNormal({
        //         error: `No suggestion channel set! Please do the setup`,
        //         type: 'reply'
        //     }, interaction);
        // }
    }
}