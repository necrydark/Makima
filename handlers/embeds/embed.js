const { EmbedBuilder, CommandInteraction } = require('discord.js');

/**
 * @param {String} text
 * @param {TextChannel} channel 
 * @param {CommandInteraction} interaction
 */

module.exports = (client) => {
    client.templateEmbed = function () {
        return new EmbedBuilder()
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.avatarURL({ size: 1024 })
            })
            .setColor('#5865F2')
            .setFooter({
                text: `Requested by: ${client.user.username}#${client.user.discriminator}`,
                iconURL: client.user.displayAvatarURL({ dynamic: true, size: 1024 })
            })
            .setTimestamp();
    }

    client.errNormal = async function ({
        embed: embed = client.templateEmbed(),
        error: error,
        type: type,
        content: content,
        components: components
    }, interaction) {
        embed.setTitle('Error!')
            .setDescription('Something went wrong!')
            .addFields(
                { name: "💬┆Error comment", value: `\`\`\`${error}\`\`\`` },
            )
            .setColor('Red')
        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    client.errUsage = async function ({
        embed: embed = client.templateEmbed(),
        usage: usage,
        type: type,
        content: content,
        components: components
    }, interaction) {
        embed.setTitle("Error!")
            .setDescription('You did not give the correct arguments')
            .addFields(
                { name: "💬┆Required arguments", value: `\`\`\`${usage}\`\`\`` },
            )
            .setColor('Red');

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }


    client.errMissingPerms = async function ({
        embed: embed = client.templateEmbed(),
        perms: perms,
        type: type,
        content: content,
        components: components
    }, interaction) {
        embed.setTitle(`・Error!`)
        embed.setDescription(`You don't have the right permissions`)
        embed.addFields(
            { name: "🔑┆Required Permission", value: `\`\`\`${perms}\`\`\`` },
        )
        embed.setColor('Red')

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }


    client.errNoPerms = async function ({
        embed: embed = client.templateEmbed(),
        perms: perms,
        type: type,
        content: content,
        components: components
    }, interaction) {
        embed.setTitle(`・Error!`)
        embed.setDescription(`I don't have the right permissions`)
        embed.addFields(
            { name: "🔑┆Required Permission", value: `\`\`\`${perms}\`\`\`` },
        )
        embed.setColor('Red')

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    // Wait error

    client.errWait = async function ({
        embed: embed = client.templateEmbed(),
        time: time,
        type: type,
        content: content,
        components: components
    }, interaction) {
        embed.setTitle(`・Error!`)
        embed.setDescription(`You've already done this once`)
        embed.addFields(
            { name: "⏰┆Try again on", value: `<t:${time}:f>` },
        )
        embed.setColor('Red')

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    //----------------------------------------------------------------//
    //                        SUCCES MESSAGES                         //
    //----------------------------------------------------------------//

    // Normal succes
    client.succNormal = async function ({
        embed: embed = client.templateEmbed(),
        text: text,
        fields: fields,
        type: type,
        content: content,
        components: components
    }, interaction) {
        embed.setTitle(`・Success!`)
        embed.setDescription(`${text}`)
        embed.setColor('Green')

        if (fields) embed.addFields(fields);

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    //----------------------------------------------------------------//
    //                        BASIC MESSAGES                          //
    //----------------------------------------------------------------//

    // Default
    client.embed = async function ({
        embed: embed = client.templateEmbed(),
        title: title,
        desc: desc,
        color: color,
        image: image,
        author: author,
        url: url,
        footer: footer,
        thumbnail: thumbnail,
        fields: fields,
        content: content,
        components: components,
        type: type
    }, interaction) {
        if (interaction.guild == undefined) interaction.guild = { id: "0" };

        if (title) embed.setTitle(title);
        if (desc && desc.length >= 2048) embed.setDescription(desc.substr(0, 2044) + "...");
        else if (desc) embed.setDescription(desc);
        if (image) embed.setImage(image);
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (fields) embed.addFields(fields);
        if (author) embed.setAuthor(author);
        if (url) embed.setURL(url);
        // if (footer) embed.setFooter({ text: footer });
        if (footer) embed.setFooter({ text: footer });

        if (color) embed.setColor(color);
        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    client.simpleEmbed = async function ({
        title: title,
        desc: desc,
        color: color,
        image: image,
        author: author,
        thumbnail: thumbnail,
        fields: fields,
        url: url,
        content: content,
        components: components,
        type: type
    }, interaction) {

        let embed = new EmbedBuilder()
            .setColor('Green')

        if (title) embed.setTitle(title);
        if (desc && desc.length >= 2048) embed.setDescription(desc.substr(0, 2044) + "...");
        else if (desc) embed.setDescription(desc);
        if (image) embed.setImage(image);
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (fields) embed.addFields(fields);
        if (author) embed.setAuthor(author[0], author[1]);
        if (url) embed.setURL(url);
        if (color) embed.setColor(color);

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    client.sendEmbed = async function ({
        embeds: embeds,
        content: content,
        components: components,
        type: type
    }, interaction) {
        if (type && type.toLowerCase() == "edit") {
            return await interaction.edit({
                embeds: embeds,
                content: content,
                components: components,
                fetchReply: true
            }).catch(e => { });
        }
        else if (type && type.toLowerCase() == "editreply") {
            return await interaction.editReply({
                embeds: embeds,
                content: content,
                components: components,
                fetchReply: true
            }).catch(e => { });
        }
        else if (type && type.toLowerCase() == "reply") {
            return await interaction.reply({
                embeds: embeds,
                content: content,
                components: components,
                fetchReply: true
            }).catch(e => { });
        }
        else if (type && type.toLowerCase() == "update") {
            return await interaction.update({
                embeds: embeds,
                content: content,
                components: components,
                fetchReply: true
            }).catch(e => { });
        }
        else if (type && type.toLowerCase() == "ephemeraledit") {
            return await interaction.editReply({
                embeds: embeds,
                content: content,
                components: components,
                fetchReply: true,
                ephemeral: true
            }).catch(e => { });
        }
        else if (type && type.toLowerCase() == "ephemeral") {
            return await interaction.reply({
                embeds: embeds,
                content: content,
                components: components,
                fetchReply: true,
                ephemeral: true
            }).catch(e => { });
        }
        else {
            return await interaction.reply({
                embeds: embeds,
                content: content,
                components: components,
                fetchReply: true
            }).catch(e => { });
        }
    }
}