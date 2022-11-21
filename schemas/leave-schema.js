const { model, Schema } = require('mongoose');

let leaveSchema = new Schema({
    Guild: String,
    Channel: String,
    Msg: String,
    URL: String,
});

module.exports = model("LeaveSchema", leaveSchema);