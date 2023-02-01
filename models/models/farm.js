const mongoose = require('mongoose');
const { Schema } = mongoose;

const FarmSchema = new Schema({
    name: String,
    location: String,
    products: [
        { type: Schema.Types.ObjectId, ref: 'Product' }
    ]
})

module.exports = mongoose.model("Farm", FarmSchema);