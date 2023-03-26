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
  for (let i = 0; i < 200; i++) {
    const price = Math.floor(Math.random() * 50) * 10;
    const rand = Math.floor(Math.random() * 1000);
    const campground = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${locations[rand].city}, ${locations[rand].state}`,
      imgUrl: [
        {
          url: 'https://res.cloudinary.com/duvv7hcdu/image/upload/v1677988958/TBCamp/usndtkwdev2jqqxjdb8h.jpg',
          fileName: 'TBCamp/xksgibnzf2ipqpldw9np',
        },
        {
          url: 'https://res.cloudinary.com/duvv7hcdu/image/upload/v1677989782/TBCamp/wuhtrbcz9mnedsbfr4jn.jpg',
          fileName: 'TBCamp/wuhtrbcz9mnedsbfr4jn',
        }
      ],
      geometry: {
        type: 'Point',
        coordinates: [locations[rand].longitude, locations[rand].latitude]
      },
      author: '63f3b196d6c4ac6c16520b92',
      //64002fac766b621b6c6ac794 is from work
      //63f3b196d6c4ac6c16520b92 is from home
      price: price,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    });

    console.log(campground);
    campground.save();
  }
};
