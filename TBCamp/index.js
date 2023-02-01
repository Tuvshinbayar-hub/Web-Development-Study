const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const morgan = require("morgan");
const Joi = require("joi");
const path = require("path");

const asyncWrapper = require("./utils/asyncWrapper");
const ExpressError = require("./utils/expressError");
const Campground = require("./models/campground.js");
const { campgroundSchema } = require("./schemas");
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
app.use(express.static(path.join(__dirname), {
  setHeaders: function (res, path, stat) {
    res.set('Content-Type', 'text/javascript');
  }
}));
// app.use((req, res, next) => {
//   console.log("first call from middleware");
//   return next();
// })

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);

  if (error !== undefined) {
    throw new ExpressError(401, error.details.map(err => err.message).join(','));
  } else {
    next();
  }
}

app.use(function (err, req, res, next) {
  console.log("************ERROR***************");
  next(err);
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

  app.get("/campgrounds", asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({}).lean();
    res.render("./campgrounds/index", { campgrounds });
  }));

  app.get("/campgrounds/new", (req, res) => {
    res.render("./campgrounds/new");
  });

  app.post("/campgrounds/new", validateCampground, asyncWrapper(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect("/campgrounds");
  }));

  app.get("/campgrounds/:id", asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id).lean();
    res.render("./campgrounds/show", { campground });
  }));

  app.get("/campgrounds/:id/edit", asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).lean();
    res.render("./campgrounds/edit", { campground });
  }));

  app.patch("/campgrounds/:id/edit", validateCampground, asyncWrapper(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    res.redirect("/campgrounds");
  }))

  app.delete("/campgrounds/:id", asyncWrapper(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  }))

  app.all("*", (req, res, next) => {
    next(new ExpressError(404, 'Page not found'));
  })

  app.use((err, req, res, next) => {
    const { status = 404, message = 'Something went wrong' } = err;
    if (!err) err.message = "Uhh no! Something went wrong";
    res.status(status).render("error", { err });
  })

  app.listen("3000", () => {
    console.log("Listening to port 3000");
  });
}


