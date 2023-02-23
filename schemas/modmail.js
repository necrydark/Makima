const { model, Schema } = require('mongoose');

const mailSchema = new Schema({
    GuildID: String,
    User: String
});

module.exports = model('mailSchema', mailSchema)