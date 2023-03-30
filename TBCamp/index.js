if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const campgroundRouter = require("./routes/campgrounds");
const reviewRouter = require("./routes/reviews");
const userRouter = require('./routes/users');
const ExpressError = require("./utils/expressError");
const User = require('./models/user');
const app = express();

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/tbcamp";

app.engine(
  "handlebars",
  exphbs.engine({
    helpers: {
      eq: function (a, b) {
        return a === b;
      },
      eqAsString: function (a, b) {
        const temp1 = a.toString();
        const temp2 = b.toString();

        return temp1 === temp2;
      },
      json: function (obj) {
        return JSON.stringify(obj);
      },
      section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      },
      prod: function () {
        return process.env.NODE_ENV != 'production';
      }
    },
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));
app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: function (res, path, stat) {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'text/javascript');
    }
  }
}));

mongoose.set("strictQuery", false);

const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
  }),
  secret: process.env.SECRET || 'justSecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    name: 'sessionID',
    httpOnly: true,
    //secure: true, For now it's commented 'cause local host is not considered as 
    //https or http secure. So, it does not work in local host. 
    expires: Date.now() + 1000 * 3600 * 24 * 7,
    maxAge: 1000 * 3600 * 24 * 7
  }
};

app.use(session(sessionConfig));
app.use(flash());

//Security Section
const connectSrcUrls = [
  'https://unpkg.com/',
  'https://api.maptiler.com/',

];
const scriptSrcUrls = [
  'https://unpkg.com/',
  'https://cdn.jsdelivr.net/',
];
const styleSrcUrls = [
  'https://cdn.jsdelivr.net/',
  'https://unpkg.com/',
];
const fontSrcUrls = [];

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [
          "'self'",
          "blob:",
          "data:",
          "https://res.cloudinary.com/duvv7hcdu/",
          "https://images.unsplash.com/",

          'https://wallpaperaccess.com/', // is for wallpaper
          'https://northeastohiofamilyfun.com/', // is for login page 
        ],
        fontSrc: ["'self'", ...fontSrcUrls],
      }
    },
    crossOriginEmbedderPolicy: false,
  })
);

//Passport section
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);

  app.use((req, res, next) => {
    res.locals.returnTo = req.session.returnTo;
    if (req.user) {
      res.locals.currentUser = req.user.toJSON();
    }
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
  })

  app.use('/', userRouter);
  app.use('/campgrounds', campgroundRouter);
  app.use('/campgrounds/:id/reviews', reviewRouter);

  app.get('/', (req, res) => {
    console.log(req.query);
    res.render('home');
  })

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