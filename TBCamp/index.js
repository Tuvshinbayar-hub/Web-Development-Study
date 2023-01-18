const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const morgan = require("morgan");

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));
app.use((req, res, next) => {
  console.log("first call from middleware");
  return next();
})

mongoose.set("strictQuery", false);
// const verifyPassword = (req, res, next) => {
//   if (req.query.password != "dogo123") {
//     res.send("You need password to enter");
//   } else {
//     next();
//   }
// }

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/tbcamp");

  // const db = mongoose.connection;
  // db.on("error", console.error.bind(console, "connection error:"));
  // db.once("open", () => {
  //   console.log("Database connected");
  // });

  app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({}).lean();
    res.render("./campgrounds/index", { campgrounds });
  });

  app.get("/campgrounds/new", (req, res) => {
    res.render("./campgrounds/new");
  });
  app.post("/campgrounds/new", async (req, res) => {
    console.log(req.body.title);
    const { title, location } = req.body.campground;
    const campground = new Campground({ title: title, location: location });
    await campground.save();
    res.redirect("/campgrounds");
  })

  app.get("/campgrounds/:id", async (req, res) => {
    const campground = await Campground.findById(req.params.id).lean();
    res.render("./campgrounds/show", { campground });
  });

  app.get("/campgrounds/:id/edit", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const campground = await Campground.findById(id).lean();
    console.log(campground);
    res.render("./campgrounds/edit", { campground });
  })

  app.patch("/campgrounds/:id/edit", async (req, res) => {
    const { title, location } = req.body.campground;
    console.log(`${title}, ${location}`);
    await Campground.findByIdAndUpdate(req.params.id, { title: title, location: location });
    res.redirect("/campgrounds");
  })

  app.delete("/campgrounds/:id", async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })

  app.listen("3000", () => {
    console.log("Listening to port 3000");
  });
}


