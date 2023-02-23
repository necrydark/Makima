const { model, Schema } = require('mongoose');

const suggestionChannel = new Schema({
    GuildID: String,
    Channel: String,
});

module.exports = model('suggestionChannel', suggestionChannel);