const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const farmSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    city: {
        type: String,
        require: true
    },
    products: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    ]
})

module.exports = mongoose.model("Farm", farmSchema);