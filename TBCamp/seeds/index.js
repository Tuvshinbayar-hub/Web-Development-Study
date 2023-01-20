const mongoose = require("mongoose");
const Campground = require("../models/campground.js");
const locations = require("./locations.js");
const { descriptors, places } = require("./seedHelpers.js");

mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/tbcamp");
  await Campground.deleteMany({});

  InitData();
}

const sample = (arr) => {
  const rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
};

const InitData = () => {
  for (let i = 0; i < 50; i++) {
    const price = Math.floor(Math.random() * 50) * 10;
    const rand = Math.floor(Math.random() * 1000);
    const campground = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${locations[rand].city}, ${locations[rand].state}`,
      imgUrl: "https://source.unsplash.com/random?InTheWoods",
      price: price,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    });

    console.log(campground);
    campground.save();
  }
};
