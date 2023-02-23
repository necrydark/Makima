const { model, Schema } = require('mongoose');

const logChannelSchema = new Schema({
    GuildID: String,
    Channel: String,
});

module.exports = model('logChannelSchema', logChannelSchema);