const Category = require("../models/category");
const Product = require("../models/product");

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const [
    allCategories,
    numCategories,
    numProducts
  ] = await Promise.all([
    Category.find().sort({name:1}),
    Category.countDocuments({}).exec(),
    Product.countDocuments({}).exec()
  ])
  res.render("index", {
    title: "Inventory Index",
    category_list: allCategories,
    category_count: numCategories,
    product_count: numProducts
  });
});

exports.product_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();
  res.render("product_form", {
    title: "Create Product",
    categories: allCategories
  })
});

exports.product_create_post= [
  body("name")
    .trim()
    .isLength({ min:1 })
    .escape()
    .withMessage("Name must be specified"),
  body("category")
    .trim()
    .isLength({ min:1 })
    .escape(),
  body("description")
    .trim()
    .escape(),
  body("price")
    .trim()
    .isLength({ min:1 })
    .escape()
    .withMessage("Price must be specified"),
  body("image")
    .trim(),
  body("stockAmount")
    .trim()
    .isLength({ min:1 })
    .escape()
    .withMessage("Stock Amount must be specified"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      image: req.body.image,
      stockAmount: req.body.stockAmount
    })

    if (!errors.isEmpty()) {
      res.render("product_form", {
        title: "Create Product",
        product: product,
        errors: errors.array()
      });
      return;
    } else {
      await product.save();
      res.redirect(product.url);
    }
  })
];

exports.product_delete_get= asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).exec();

  if (product === null) {
    res.redirect("/products");
  }

  res.render("product_delete", {
    title: "Delete Product",
    product: product
  })
});

exports.product_delete_post= asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).exec();

  await Product.findByIdAndRemove(req.body.productid);
  res.redirect("/products");
});

exports.product_update_get= asyncHandler(async (req, res, next) => {
  const [product, allCategories] = await Promise.all([
    Product.findById(req.params.id).exec(),
    Category.find().exec()
  ]);

  if (product === null) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  } 
  res.render("product_form", {
    title: "Update Product",
    product: product,
    categories: allCategories
  })
});

exports.product_update_post= [
  body("name")
    .trim()
    .isLength({ min:1 })
    .escape()
    .withMessage("Name must be specified"),
  body("category")
    .trim()
    .isLength({ min:1 })
    .escape(),
  body("description")
    .trim()
    .escape(),
  body("price")
    .trim()
    .isLength({ min:1 })
    .escape()
    .withMessage("Price must be specified"),
  body("image")
    .trim()
    .escape(),
  body("stockAmount")
    .trim()
    .isLength({ min:1 })
    .escape()
    .withMessage("Stock Amount must be specified"),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
      stockAmount: req.body.stockAmount,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      const [product, allCategories] = await Promise.all([
        Product.findById(req.params.id).exec(),
        Category.find().exec()
      ]);
      res.render("product_form", {
        title: "Update Product",
        product: product,
        categories: allCategories,
        errors: errors.array()
      });
      return;
    } else {
      const theproduct = await Product.findByIdAndUpdate(req.params.id, product);
      res.redirect(theproduct.url);
    }
  })
];

exports.product_detail= asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("category").exec();

  if (product === null ) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  res.render("product_detail", {
    product: product
  })
});

exports.product_list= asyncHandler(async (req, res, next) => {
  const allProducts = await Product.find({}, "name category price")
    .sort({name:1})
    .populate("category")
    .exec();
  
  res.render("product_list", {
    title: "Product List",
    product_list: allProducts
  })
});