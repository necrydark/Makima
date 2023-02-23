const { model, Schema } = require('mongoose');

const tempBanSchema = new Schema({
    GuildID: String,
    userId: String,
    expires: Date,

});

module.exports = model("tempban", tempBanSchema);