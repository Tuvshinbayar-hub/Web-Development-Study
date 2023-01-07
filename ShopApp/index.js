const express = require("express");
const exphbs = require("express-handlebars");
const path = require('path');
const Product = require('./models/product.js')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
mongoose.set('strictQuery', false);

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/shopApp');

    app.engine('handlebars', exphbs.engine());
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'handlebars');
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/products', async (req, res) => {
        const products = await Product.find().lean();
        res.render("./products/products", { products });
    })

    app.get('/products/new', (req, res) => {
        res.render('./products/new');
    })

    app.post('/products/new', async (req, res) => {
        console.log(req.body);
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.redirect(`${newProduct._id}`);
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


