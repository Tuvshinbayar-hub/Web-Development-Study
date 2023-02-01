const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    first: String,
    last: String,
    addresses: [
        {
            _id: { id: false },
            street: String,
            state: String,
            city: String,
        }
    ]
})

module.exports = mongoose.model("User", UserSchema);