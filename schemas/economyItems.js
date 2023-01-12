const {model, Schema } = require('mongoose');

const economyItems = new Schema({
    GuildID: String,
    User: String,
    FishingRod: {type: Boolean, default: false},
    FishingRodUsage: {type: Number, default: 0}
});

module.exports = model('economyItems', economyItems);