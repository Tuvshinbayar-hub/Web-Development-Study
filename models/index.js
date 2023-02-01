const mongoose = require("mongoose");
const User = require("./models/user");
const Farm = require("./models/farm");
const Product = require("./models/product");
const Tweet = require("./models/tweet");
const express = require("express");

const app = express();


mongoose.set("strictQuery", false);
// mongoose.set("strictPopulate", false);

main().catch(err => console.log(err));


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/userDemo');

    const user = new User({
        first: "Naruto",
        last: "Uzumaki",
        addresses: [
            {
                street: "Sesame St.",
                state: "Hogake",
                city: "Konoha",
            }
        ]
    })



    // await Product.insertMany([
    //     { name: "Cow milk", price: 2.99, seasen: 'spring' },
    //     { name: "Aaruul", price: 3.99, seasen: 'summer' },
    //     { name: "Airag", price: 4.99, seasen: 'summer' },
    //     { name: "Alcohol", price: 3.99, seasen: 'summer' },
    // ])

    // const newFarm = new Farm({
    //     name: "Jerry's",
    //     location: "Erdenet, Mongolia",
    // })

    // const productToAdd = await Product.findOne({ name: "Alcohol" });
    // const foundFarm = await Farm.findOne({ name: "Jerry's" })
    //     .populate('products')
    //     .then(res => console.log(res.products));

    // newFarm.products.push(productToAdd);
    // await newFarm.save();

    //foundFarm.save();

    addNewTweet();

    app.listen("3000", () => {
        console.log("Listening to port 3000");
    });
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const addNewTweet = async () => {
    // const newTweet = new Tweet({
    //     text: 'Saaaasgaaaaay!',
    //     likes: 1,
    // })

    const tweet = await Tweet.findOne({ likes: 1 }).populate('parent');

    // const naruto = await User.findOne({ first: 'Naruto' });
    // tweet.parent = naruto;
    // await tweet.save();

    console.log(tweet);
}



const addAddress = async (id) => {
    const user = await User.findOne({ _id: id });
    console.log(user.addresses);

    user.addresses.push(
        {
            street: "A",
            state: "B",
            city: "C",
        }
    )

    user.save();
}