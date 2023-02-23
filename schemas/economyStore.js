const { model, Schema } = require('mongoose');

const economyStore = new Schema({
    GuildID: String,
    Role: String,
    Amount: Number
});

module.exports = model('economyStore', economyStore);