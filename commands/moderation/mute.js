const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits} = require('discord.js');
// const { PermissionsBitField } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutes the user you want!')
        
        .addUserOption(option => option.setName('target').setDescription('User you want to mute').setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason as to why user needs to be muted')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const logChannel = interaction.guild.channels.cache.find(ch => ch.name === "logged-users");
        const target = interaction.options.getMember('target')
        const reason = interaction.options.getString('reason');
        let role = interaction.guild.roles.cache.find(r => r.name === 'muted')

        if(!target) await interaction.reply('You need to add a target!');
        if(!role) await interaction.reply('You need to create a role called muted');
        if(!logChannel) return (`Channel does not exist! Please create a channel with the name ${logChannel.name}`);
        

        
        if(target.roles.cache.some(r => r.name === 'muted')) {
            await interaction.reply("User is already muted!");
        } else {
            if(role){
                if(target && !reason) {
                    const embed = new EmbedBuilder()
                    .setColor('GREEN')
                    .setDescription(`✅ ${target} has been muted by ${interaction.user}`);
                    target.roles.add(role);
                    logChannel.send({embeds: [embed]});
                    await interaction.reply({ embeds: [embed]});
    
                } else {
                    const embed = new EmbedBuilder()
                    .setColor('GREEN')
                    .setDescription(`✅ ${target} has been muted for ${reason} by ${interaction.user}`);
                    target.roles.add(role);
                    logChannel.send({embeds: [embed]});
                    await interaction.reply({ embeds: [embed]});
                }   
            }
           
        }

     
    },
};