#! /usr/bin/env node

  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Product = require("./models/product");
  const Category = require("./models/category");

  const apiURL = 'https://acnhapi.com/v1a/'
  
  const products = [];
  const categories = [];
  const fetchedData = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false); // Prepare for Mongoose 7
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createProducts();
    //console.log("Debug: Closing mongoose");
    //await mongoose.connection.close();
  }
  
  async function categoryCreate(name) {
    const category = new Category({ name: name });
    await category.save();
    categories[category.name] = category._id;
    const data = await fetch(`${apiURL}${name}`);
    const items = await data.json();
    fetchedData[name] = [...items];
    console.log(`Added category: ${name}`);
  }
  
  async function productCreate(data, category) {
    productdetail = {
        name: data.name["name-USen"],
        description: data["museum-phrase"],
        category: category,
        price: data.price,
        image: data["image_uri"],
        stockAmount: 10
    };
  
    const product = new Product(productdetail);
    await product.save();
    products.push(product);
    console.log(`Added product: ${product.name}`);
  }
  
  async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
      categoryCreate("fish"),
      categoryCreate("sea"),
      categoryCreate("bugs"),
      categoryCreate("fossils")
    ]);
  }
  
  async function createProducts() {
    console.log("Adding Products");
    const fishId = categories["fish"];
    const seaId = categories["sea"];
    const bugsId = categories["bugs"];
    const fossilsId = categories["fossils"];
    fetchedData["fish"].forEach(async(data) => {
        await productCreate(data, fishId);
    }),
    fetchedData["sea"].forEach(async(data) => {
        await productCreate(data, seaId);
    }),
    fetchedData["bugs"].forEach(async(data) => {
        await productCreate(data, bugsId);
    }),
    fetchedData["fossils"].forEach(async(data) => {
        await productCreate(data, fossilsId);
    })
  }