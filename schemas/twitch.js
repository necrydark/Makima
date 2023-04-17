const { model, Schema } = require('mongoose');

const twitchChannel = new Schema({
    GuildID: String,
    Channel: String,
});

module.exports = model('twitchChannel', twitchChannel);