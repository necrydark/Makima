const { ActivityType } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

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
        console.log(`Logged in as ${client.user.tag}`);
        client.user.setPresence({
            activities: [{ name: 'with my dogs...', type: 'PLAYING' }],
            status: 'idle'
        });
    },
};