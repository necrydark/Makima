const { EmbedBuilder } = require("@discordjs/builders");
const { GuildMember, Embed, InteractionCollector } = require("discord.js");
const welcomeSchema = require("../../schemas/welcome-schema");

module.exports = {
    name: "guildMemberAdd",
    async execute(member, client) {
        const { guild } = member;
        welcomeSchema.findOne({ GuildID: member.guild.id }, async (err, data) => {
            if (!data) return;
            let channel = data.Channel;
            let Msg = data.Msg || " ";
            let Role = data.Role;
            let Image = data.URL;


            const welcomeChannel = member.guild.channels.cache.get(channel);

            const welcomeEmbed = new EmbedBuilder()
                .setTitle(`**New Member!**`)
                .setDescription(`<@${member.id}> ${Msg}`)
                .setColor(0x037821)
                .setImage(Image)
                .addFields({ name: 'Total members', value: `${guild.memberCount}` })
                .setTimestamp();

            welcomeChannel.send({ embeds: [welcomeEmbed] });
            member.roles.add(Role);
        })
    },
};