const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const Campground = require("./models/campground.js");
const path = require("path");
const app = express();

app.engine(
  "handlebars",
  exphbs.engine({
    helpers: {
      eq: function (a, b) {
        return a === b;
      },
    },
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/tbcamp");

  const db = mongoose.connection;
  // db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("Database connected");
  });

  app.get("/", (req, res) => {
    Campground.insertMany([
      {
        title: "1",
        price: "1",
        description: "1",
        location: "1",
      },
    ]);
    res.render("home");
  });

  app.get("/makeCampground", async (req, res) => {
    const campground = new Campground({
      title: "Nami",
      price: "200",
      description: "Really cool place to camp",
      location: "Nowhere",
    });

    await campground.save();
    res.send(campground);
  });

  app.listen("3000", () => {
    console.log("Listening to port 3000");
  });
}
