const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Permissions } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutes the user you want!')
        
        .addUserOption(option => option.setName('target').setDescription('User you want to mute').setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason as to why user needs to be muted')
                .setRequired(false)),
                permissions: [Permissions.FLAGS.MANAGE_MESSAGES],

    async execute(interaction) {
        const target = interaction.options.getMember('target')
        const reason = interaction.options.getString('reason');
        let role = interaction.guild.roles.cache.find(r => r.name === 'muted')

        if(!target) await interaction.reply('You need to add a target!');
        if(!role) await interaction.reply('You need to create a role called muted');

        if(target.roles.cache.some(r => r.name === 'muted')) {
            await interaction.reply("User is already muted!");
        } else {
            if(target && !reason) {
                const embed = new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`✅ ${target} has been muted`);
                target.roles.add(role);
                await interaction.reply({ embeds: [embed]});
            } else {
                const embed = new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`✅ ${target} has been muted for ${reason}`);
                target.roles.add(role);
                await interaction.reply({ embeds: [embed]});
            }    
        }

     
    },
};