const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require('connect-flash');
const session = require('express-session');

const sessionPreferences = { secret: 'holyJojo', resave: false, saveUninitialized: false };
const Product = require("./models/product.js");
const Farm = require("./models/farm");

const app = express();

app.engine(
  "handlebars",
  exphbs.engine({
    helpers: {
      eq: function (a, b) {
        return a === b;
      },

      ne: function (a, b) {
        return a !== b;
      },
    },
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session(sessionPreferences));
app.use(flash());

mongoose.set("strictQuery", false);
app.use((req, res, next) => {
  res.locals.messages = req.flash('newFarm');
  next();
})

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/shopApp2");

  //app.engine('handlebars', exphbs.engine());
  const categories = ["fruit", "vegetable", "drink"];

  app.get("/products", async (req, res) => {
    let { category } = req.query;
    let products = null;

    if (category) {
      products = await Product.find({ category: category }).lean();
      res.render("./products/products", { products, category });
    } else {
      products = await Product.find().lean();
      category = "all";
    }
    res.render("./products/products", { products, category });
  });

  app.get("/products/new", (req, res) => {
    res.render("./products/new", { categories });
  });

  app.post("/products/new", async (req, res) => {
    console.log(req.body);
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`${newProduct._id}`);
  });

  app.get("/products/:id/edit", async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id).lean();
    const selectedCategory = product.category;
    res.render("./products/edit", { product, categories, selectedCategory });
  });

  app.patch("/products/:id", async (req, res) => {
    const { id } = req.params;
    const { name, price, category } = req.body;

    await Product.findOneAndUpdate(
      { _id: id },
      { $set: { name: name, price: price, category: category } }
    );
    res.redirect("/products");
  });

  app.delete("/products/:id", async (req, res) => {
    console.log("delete is called");
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/farms");
  });

  app.get("/products/:id", async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id)
      .populate('farm').lean();
    res.render("./products/details", { product });
  });

  app.get("/farms", async (req, res) => {
    const farms = await Farm.find({}).lean();
    res.render("./farms/index", { farms });
  })

  app.get('/farms/new', (req, res) => {
    res.render('./farms/new');
  })

  app.post("/farms/new", async (req, res) => {
    const newFarm = new Farm(req.body);
    await newFarm.save();
    req.flash('newFarm', 'You have created a new farm');
    res.redirect('/farms');
  })

  app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id)
      .populate('products').lean();
    console.log(farm);
    if (farm)
      res.render('./farms/show', { farm })
  })

  app.delete('/farms/:id', async (req, res) => {
    await Farm.findByIdAndDelete(req.params.id);
    res.redirect('/farms');
  })

  app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    res.render('./products/new', { categories, id });
    //const product = new Product(req.body);
  })

  app.post('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    let farm = await Farm.findById(id);
    const product = new Product(req.body)

    farm.products.push(product);
    product.farm = farm;

    await farm.save();
    await product.save();

    farm = await Farm.findById(id).populate('products').lean();
    res.render('./farms/show', { farm });
  })

  app.listen(3000, () => {
    console.log("port 3000 is connected");
  });
}
