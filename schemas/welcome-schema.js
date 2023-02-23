const { model, Schema } = require('mongoose');

let welcomeSchema = new Schema({
    GuildID: String,
    Channel: String,
    Msg: String,
    Role: String,
    URL: String,
});

module.exports = model("WelcomeSchema", welcomeSchema);