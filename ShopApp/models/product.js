const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true
    },
    category: {
        enum: ['fruit', 'drink', 'vegetable'],
        type: String,
        lowercase: true,
        require: true
    }
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;