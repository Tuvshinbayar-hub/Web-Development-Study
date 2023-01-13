const mongoose = require("mongoose");
const Campground = require("../models/campground.js");
const locations = require("./locations.js");

mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/tbcamp");

  Campground.deleteMany({});
  InitData();
}

const InitData = () => {
  for (let i = 0; i < 50; i++) {
    const rand = Math.floor(Math.random() * 1000);
    const campground = new Campground({
      location: `${locations[rand].city} ${locations[rand].state}`,
    });
    campground.save();
  }
};
