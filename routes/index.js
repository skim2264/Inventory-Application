var express = require('express');
var router = express.Router();

const category_controller = require("../controllers/categoryController");
const product_controller = require("../controllers/productController");

/// PRODUCT ROUTES ///
//GET homepage
router.get('/', product_controller.index);

//GET and POST requests for creating a product
router.get('/product/create', product_controller.product_create_get);
router.post('/product/create', product_controller.product_create_post);

//GET and POST requests for deleting a product
router.get('/product/:id/delete', product_controller.product_delete_get);
router.post('/product/:id/delete', product_controller.product_delete_post);

//GET and POST requests for updating a product
router.get('/product/:id/update', product_controller.product_update_get);
router.post('/product/:id/update', product_controller.product_update_post);

//GET request for one product
router.get("/product/:id", product_controller.product_detail);

//GET request for list of all products
router.get("/products", product_controller.product_list);

/// CATEGORY ROUTES ///
//GET and POST requests for creating a category
router.get('/category/create', category_controller.category_create_get);
router.post('/category/create', category_controller.category_create_post);

//GET and POST requests for deleting a category
router.get('/category/:id/delete', category_controller.category_delete_get);
router.post('/category/:id/delete', category_controller.category_delete_post);

//GET and POST requests for updating a category
router.get('/category/:id/update', category_controller.category_update_get);
router.post('/category/:id/update', category_controller.category_update_post);

//GET request for one category
router.get("/category/:id", category_controller.category_detail);

//GET request for list of all category items
router.get("/categories", category_controller.category_list);


module.exports = router;
