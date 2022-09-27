const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config.json');

const commands = [];

const commandsFolder = fs.readdirSync("./commands");
for (const folder of commandsFolder) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const commandFile = require(`./commands/${folder}/${file}`);
        commands.push(commandFile.data.toJSON());


    }
}

// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// for (const file of commandFiles) {
//     const command = require(`./commands/${file}`);
//     commands.push(command.data.toJSON());
// }
const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Refreshing / commands');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log('Finished refreshing / commands');
    } catch (error) {
        console.log(error);
    }
})();