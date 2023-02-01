const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    season: ['spring', 'summer', 'fall', 'winter'],
})

module.exports = mongoose.model("Product", ProductSchema);