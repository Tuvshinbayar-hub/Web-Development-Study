const mongoose = require('mongoose');
const Product = require('./product');

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

farmSchema.pre('findOneAndDelete', async (data)=>{
    console.log('Pre is called');
    console.log(data);
})

farmSchema.post('findOneAndDelete', async (farm)=>{
    console.log('Post is called');
    console.log(farm);
    if(farm.products.length)
        await Product.deleteMany({_id: {$in: farm.products}});
})

module.exports = mongoose.model("Farm", farmSchema);