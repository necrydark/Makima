const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Message } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Get the avatar URL of the selected user, or your own avatar.')
		.addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		if (user) {
            const embed = new MessageEmbed()
            .setTitle(`**${user.username}#${user.discriminator} Avatar**`)
            .setColor('BLUE')
            .setImage(`${user.displayAvatarURL({dynamic:true, size: 1024})}`)
            .addFields(
                { name: 'Image links', value: `[png](${user.avatarURL({ format: 'png'})}) | [Webp](${user.avatarURL({dynamic: true})}) | [jpg](${user.avatarURL({format:'jpg'})}) | [gif](${user.avatarURL({format: 'gif'})})`}
            )
            // .setDescription(`[png](${user.avatarURL({ format: 'png'})}) | [Webp](${user.avatarURL({dynamic: true})}) | [jpg](${user.avatarURL({format:'jpg'})}) | [gif](${user.avatarURL({format: 'gif'})})`)
            .setFooter(`Requested by: ${user.username}#${user.discriminator}`, user.displayAvatarURL({dynamic: true}));
           return interaction.reply({embeds: [embed]});
        } else {
            const embed = new MessageEmbed()
            .setTitle(`**${interaction.user.username}#${interaction.user.discriminator} Avatar**`)
            .setColor('BLUE')
            .setImage(`${interaction.user.displayAvatarURL({dynamic:true, size: 1024})}`)
            .addFields(
                { name: 'Download using ', value: 'Downloda the image using:'},
                { name: 'Image links', value: `[png](${interaction.user.avatarURL({ format: 'png'})}) | [Webp](${interaction.user.avatarURL({dynamic: true})}) | [jpg](${interaction.user.avatarURL({format:'jpg'})}) | [gif](${interaction.user.avatarURL({format: 'gif'})})`}
            )
            // .setDescription(`[png](${interaction.user.avatarURL({ format: 'png'})}) | [Webp](${interaction.user.avatarURL({dynamic: true})}) | [jpg](${interaction.user.avatarURL({format:'jpg'})}) | [gif](${interaction.user.avatarURL({format: 'gif'})})`)
            .setFooter(`Requested by: ${interaction.user.username}#${interaction.user.discriminator}`, interaction.user.displayAvatarURL({dynamic: true}));
           return interaction.reply({embeds: [embed]});
        }
	},
};