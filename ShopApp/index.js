const express = require("express");
const exphbs = require("express-handlebars");
const path = require('path');
const Product = require('./models/product.js')
const mongoose = require('mongoose');

const app = express();
mongoose.set('strictQuery', false);

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/shopApp');

    app.engine('handlebars', exphbs.engine());
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'handlebars');

    app.get('/products', async (req, res) => {
        const products = await Product.find().lean();
        res.render("./products/products", { products });
    })

    app.get('/products/:id', async (req, res) => {
        const id = req.params.id;
        const product = await Product.findById(id).lean();
        res.render("./products/details", { product });
    })

    app.listen(3000, () => {
        console.log("port 3000 is connected");
    })
}


