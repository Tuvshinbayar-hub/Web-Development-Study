const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");

const campgroundRouter = require("./routes/campgrounds");
const ExpressError = require("./utils/expressError");
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
  app.use('/', campgroundRouter);
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