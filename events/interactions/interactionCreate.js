const { CommandInteraction } = require("discord.js");
const ms = require('ms-prettify').default;

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                return interaction.reply({ content: "outdated command" });
            }
            const t = client.timeouts.get(`${interaction.user.id}_${command.name}`) || 0;

            if (Date.now() - t < 0) return interaction.reply({
                content: `You are on a timeout of ${ms(t - Date.now(), { till: 'second' })}`,
                ephemeral: true
            });

            if (command.developer && interaction.user.id !== '255769540825186305') {
                return interaction.reply({
                    content: 'This command is only available to the developer',
                    ephemeral: true
                })
            }
            client.timeouts.set(`${interaction.user.id}_${command.name}`, Date.now() + (command.timeout || 0))
            command.execute(interaction, client);
        } else {
            return;
        }
    },
};
