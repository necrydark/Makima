const { EmbedBuilder } = require("@discordjs/builders");
const { GuildMember, Embed, InteractionCollector } = require("discord.js");
const leaveSchema = require("../../schemas/leave-schema");

module.exports = {
    name: "guildMemberRemove",
    async execute(member, client) {
        const { guild } = member;
        leaveSchema.findOne({ Guild: member.guild.id }, async (err, data) => {
            if (!data) return;
            let channel = data.Channel;
            let Msg = data.Msg || " ";
            let Image = data.URL || null;


            const leaveChannel = member.guild.channels.cache.get(channel);

            const leaveEmbed = new EmbedBuilder()
                .setTitle(`**Member Left!**`)
                .setDescription(`<@${member.id}> ${Msg}`)
                .setColor(0x037821)
                .setImage(Image)
                .addFields({ name: 'Total members', value: `${guild.memberCount}` })
                .setTimestamp();

            leaveChannel.send({ embeds: [leaveEmbed] });
        })
    },
};