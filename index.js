const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActivityType, Partials } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');


const { loadEvents } = require('./loaders/eventHandler');
const { loadCommands } = require('./loaders/commandHandler');



const client = new Client({
    intents: [Object.keys(GatewayIntentBits), GatewayIntentBits.GuildPresences],
    partials: [Object.keys(Partials)],
});

client.commands = new Collection();
client.emotes = require('./config/emojis.json');
client.timeouts = new Collection();
client.developer = new Collection();


fs.readdirSync('./handlers').forEach((dir) => {
    fs.readdirSync(`./handlers/${dir}`).forEach((handler) => {
        require(`./handlers/${dir}/${handler}`)(client);
    })
})

client.login(process.env.token).then(() => {
    loadEvents(client);
    loadCommands(client);
});
