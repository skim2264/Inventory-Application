const Category = require("../models/category");
const Product = require("../models/product");

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

exports.category_create_get= asyncHandler(async (req, res, next) => {
    res.render("category_form", {title: "Create Category"});
});

exports.category_create_post= [
    //Validate and sanitize fields
    body("name")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Name must be specified.")
        .isAlphanumeric()
        .withMessage("Name has non-alphanumeric characters."),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name
        })

        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Create Category",
                category: category,
                errors: errors.array()
            });
            return;
        } else {
            await category.save();
            res.redirect(category.url);
        }
    })
];

exports.category_delete_get= asyncHandler(async (req, res, next) => {
    const [category, allProductsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Product.find({ category: req.params.id }, "name").exec()
    ])

    if(category === null) {
        res.redirect("/categories");
    }

    res.render("category_delete", {
        title: "Delete Category",
        category: category,
        products: allProductsInCategory
    })
});

exports.category_delete_post= asyncHandler(async (req, res, next) => {
    const [category, allProductsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Product.find({ category: req.params.id }, "name").exec()
    ])

    if(allProductsInCategory.length > 0) {
        res.render("category_delete", {
            title: "Delete Category",
            category: category,
            products: allProductsInCategory
        });
        return;
    } else {
        await Category.findByIdAndRemove(req.body.categoryid);
        res.redirect("/categories");
    }

    
});

exports.category_update_get= asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec();

    if (category === null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }
    res.render("category_form", {
        title: "Update Category",
        category: category
    })
});

exports.category_update_post= [
    body("name")
        .trim()
        .isLength({ min:1 })
        .escape()
        .withMessage("Name must be specified.")
        .isAlphanumeric()
        .withMessage("Name has non-alphanumeric characters."),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            const category = await Category.findById(req.params.id).exec()
            res.render("category_form", {
                title: "Update Category",
                category: category,
                errors: errors.array()
            });
            return;
        } else {
            const thecategory = await Category.findByIdAndUpdate(req.params.id, category);
            res.redirect(thecategory.url);
        }
    })
]

exports.category_detail= asyncHandler(async (req, res, next) => {
    const [category, allProductsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Product.find({ category: req.params.id }).exec()
    ])
    res.render("category_detail", {
        title: "Category Detail",
        category: category,
        products: allProductsInCategory
    })
});

exports.category_list= asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().sort({name:1});
    res.render("category_list", {
        title: "Category List",
        category_list: allCategories
    })
});