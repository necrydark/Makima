const { model, Schema } = require('mongoose');

const functionsSchema = new Schema({
    GuildID: String,
    Levels: { type: Boolean, default: false },
    Economy: { type: Boolean, default: false },
    AntiAlt: { type: Boolean, default: false },
    AntiSpam: { type: Boolean, default: false },
    AntiCaps: { type: Boolean, default: false },
    AntiInvite: { type: Boolean, default: false },
    AntiLinks: { type: Boolean, default: false },
    Prefix: String,
    Color: String
});

module.exports = model("functions", functionsSchema);