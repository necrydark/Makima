const { model, Schema } = require('mongoose');

const economyTimeout = new Schema({
    GuildID: String,
    User: String,
    Beg: String,
    Crime: String,
    Daily: String,
    Weekly: String,
    Monthly: String,
    Hourly: String,
    Work: String,
    Rob: String,
    Fish: String,
    Hunt: String,
    Yearly: String,
    Present: String
});

module.exports = model('economyTimeout', economyTimeout);