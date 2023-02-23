const { model, Schema } = require('mongoose');

let leaveSchema = new Schema({
    GuildID: String,
    Channel: String,
    Msg: String,
    URL: String,
});

module.exports = model("LeaveSchema", leaveSchema);