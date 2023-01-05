const mongoose = require('mongoose');
const Product = require('./models/product.js');
mongoose.set('strictQuery', false);

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/shopApp');

    // await Product.insertMany([
    //     { name: 'Tomato', price: 3.99, category: 'vegetable' },
    //     { name: 'Potato', price: 1.50, category: 'vegetable' },
    //     { name: 'Banana', price: 2.99, category: 'fruit' },
    //     { name: 'Milk', price: 3.99, category: 'drink' }
    // ]).then(res => console.log(res));
}
