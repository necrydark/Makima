
const { Schema, model } = require('mongoose');

let afkSchema = new Schema({
    GuildID: String,
    User: String,
    Message: { type: String, default: false }
});

module.exports = model("afkSchema", afkSchema);