const mongoose = require("mongoose");

const TweetSchema = mongoose.Schema({
    text: String,
    likes: Number,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Tweet', TweetSchema);