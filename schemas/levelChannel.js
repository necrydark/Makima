const { model, Schema } = require('mongoose');

let levelChannelSchema = new Schema({
    GuildID: String,
    Channel: String,
});

module.exports = model("levelChannelSchema", levelChannelSchema);