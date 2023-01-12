const {model, Schema } = require('mongoose');

const economySchema = new Schema({
    GuildID: String,
    User: String,
    Money: Number,
    Bank: Number
});

module.exports = model('economy', economySchema);