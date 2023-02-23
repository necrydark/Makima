const { CommandInteraction, Embed, EmbedBuilder, MessageFlags, ChannelType } = require("discord.js");
const Levels = require('discord.js-leveling');
const afk = require("../../schemas/afk");
const blacklistSchema = require("../../schemas/blacklistSchema");
const mailSchema = require('../../schemas/modmail');
const levelChannelSchema = require('../../schemas/levelChannel');
const functions = require("../../schemas/functions");



module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        if (message.channel.type === ChannelType.DM) return;

        // if (message.channel.type === ChannelType.DM) {
        //     const member = message.author;

        //     mailSchema.findOne({ GuildID: message.guild.id, User: member }, async (err, data) => {
        //         if (err) throw err;

        //         if (!data) {
        //             mailSchema.create({
        //                 GuildID: message.guild.id,
        //                 User: member
        //             })
        //         } else {
        //             mailSchema.create({
        //                 GuildID: message.guild.id,
        //                 User: member
        //             })
        //         }
        //     })
        //     if (message.attachments.size > 0) {
        //         message.react('❌');
        //         return member.sesnd('I cannot send this message!');
        //     }
        //     const postChannel = message.channels.cache.find(c => c.name === `${message.author.id}`);
        //     if (postChannel) {
        //         const embed = new EmbedBuilder()
        //             .setColor('Green')
        //             .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
        //             .setDescription(`${message.content}`);

        //         postChannel.send({ embeds: [embed] });
        //         message.react('📧');
        //         return;
        //     }
        // }




        //Blacklist Checkers
        try {
            blacklistSchema.findOne({ GuildID: message.guild.id }, async (err, data) => {
                if (data) {
                    const lowerMsg = message.content.toLowerCase();
                    const messageSplit = lowerMsg.split(' ');

                    let deleting = false;

                    await Promise.all(
                        messageSplit.map((content) => {
                            try {
                                if (data.Words.includes(content.toLowerCase())) deleting = true;
                            }
                            catch { }
                        })
                    )
                    if (deleting) return message.delete({ timeout: 1000 })

                }
            })
        }
        catch { }



        //AFK System

        afk.findOne({ GuildID: message.guild.id, User: message.author.id }, async (err, data) => {
            if (data) {
                await afk.deleteOne({
                    GuildID: message.guild.id,
                    User: message.author.id
                });
                client.simpleEmbed({
                    desc: `${message.author} is no longer afk!`,
                }, message.channel).then(async (m) => {
                    setTimeout(() => {
                        m.delete();
                    }, 5000);
                });

                if (message.member.displayName.startsWith(`[AFK]`)) {
                    let name = message.member.displayName.replace(`[AFK]`, ``);
                    message.member.setNickname(name).catch((e) => { });
                }
            }
        });

        message.mentions.users.forEach(async (u) => {
            if (
                !message.content.includes("@here") &&
                !message.content.includes("@everyone")
            ) {
                afk.findOne(
                    { GuildID: message.guild.id, User: u.id },
                    async (err, data) => {
                        if (data) {
                            client.simpleEmbed(
                                { desc: `${u} is currently afk! **Reason:** ${data.Message}` },
                                message.channel
                            );
                        }
                    }
                );
            }
        });



        //XP System

        functions.findOne({ GuildID: message.guild.id }, async (err, data) => {
            if (data) {
                if (data.Levels == true) {
                    if (!message.guild || message.author.bot) return;
                    if (message.content.length < 3) return;
                    const randomAmountOfXp = Math.floor(Math.random() * 9) + 1;
                    const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);

                    if (hasLeveledUp) {
                        const user = await Levels.fetch(message.author.id, message.guild.id);
                        levelChannelSchema.findOne({ GuildID: message.guild.id }, async (err, data) => {
                            if (!data) {
                                const errEmbed = new EmbedBuilder()
                                    .setTitle('No channel found!')
                                    .setColor('Red')
                                    .setDescription('Please setup a channel using /level-channel')
                                await message.channel.send({ embeds: [errEmbed] });
                            } else {
                                let channel = data.Channel;

                                const levelMsgChannel = message.guild.channels.cache.get(channel);
                                const levelEmbed = new EmbedBuilder()
                                    .setTitle('**New Level**')
                                    .setDescription(`**GG** ${message.author}, you just leveled up to level **${user.level + 1}** 🥳`)
                                    .setColor("Random")
                                    .setTimestamp();
                                const sendEmbed = await levelMsgChannel.send({ embeds: [levelEmbed] });
                                sendEmbed.react('🥳');
                            }
                        });
                    }
                }
            }
        })
    },
};