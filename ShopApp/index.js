const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const Product = require("./models/product.js");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

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

mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/shopApp");

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
    res.redirect("/products");
  });

  app.get("/products/:id", async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id).lean();
    res.render("./products/details", { product });
  });

  app.listen(3000, () => {
    console.log("port 3000 is connected");
  });
}
