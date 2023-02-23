
const { Schema, model } = require('mongoose');

let blacklistSchema = new Schema({
    GuildID: String,
    Words: Array,
});

module.exports = model("blacklistSchema", blacklistSchema);