const { model, Schema } = require('mongoose');

let welcomeSchema = new Schema({
    Guild: String,
    Channel: String,
    Msg: String,
    Role: String,
    URL: String,
});

module.exports = model("WelcomeSchema", welcomeSchema);