const { ActivityType } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();
const Levels = require('discord.js-leveling');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        await mongoose.connect(process.env.mongoose_URI || '', {
            keepAlive: true,
        });

        if (mongoose.connect) {
            console.log("MongoDB connection successful.")
        }

        Levels.setURL(process.env.mongoose_URI);

        console.log(`Logged in as ${client.user.tag}`);
        console.log('Developed By Dark');
        client.user.setPresence({
            activities: [{ name: 'with my dogs...', type: ActivityType.Playing }],
            status: 'idle'
        });
    },
};