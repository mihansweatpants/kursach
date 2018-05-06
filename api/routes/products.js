const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const getFormatedDate = require('../helpers/getFormatedDate');

// Configuring where to store and how to name incoming files
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads/');
    },

    filename: (req, file, callback) => {
        callback(null, `${getFormatedDate()}__${file.originalname}`);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, false);
    } else {
        callback(null, true);
    }
};

// Initializing the file upload engine and providing it the storage strategy
const upload = multer({
    storage: storage,
    limits: {
        // only accepting files up to 5mb
        fileSize: 1024 * 1024 * 5
    }
    // fileFilter: fileFilter
});

// HTTP CRUD Methods:

// Importing schema for product entity
// It will be used as a constructor for creating records of new products
// As well as querying db for existing products
const Product = require('../models/product');

// Handling /products endpoint (resource that represets all products in db)
router.get('/', (req, res, next) => {
    // Querying for all existing products
    Product.find()
        .select('name price _id productImage')
        .exec()
        // Sending json response that contains all existing products
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        url: `http://localhost:3000/products/${doc._id}`
                    };
                })
            };

            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// POST aka Create
router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    // creating an instance of new product in db
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    // saving product to db
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created product successfuly',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result.id,
                    url: `http://localhost:3000/products/${result._id}`
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// Handling requests to exact products by their id (/products/:id)

// GET aka Read
router.get('/:productId', (req, res, next) => {
    // Extracting id from request url
    const id = req.params.productId;
    // Querying db for product with that id
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        // Checking if record of that product exists in db
        .then(doc => {
            if (doc) {
                console.log('From database', doc); // confirming that the record is being pulled from the db
            } else {
                res
                    .status(404)
                    .json({ message: 'No valid entry found for provided ID' });
            }
            // Sending response with the product data parsed to json
            res.status(200).json({
                product: doc,
                allProducts: {
                    type: 'GET',
                    url: `http://localhost:3000/products`
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// PATCH aka Update (i guess)
router.patch('/:productId', (req, res, next) => {
    // Extracting id from request url
    const id = req.params.productId;

    // Looping over request body
    // to create an object of properties of some product
    // that should be updated in db
    const updateOptions = {};
    for (const ops of req.body) {
        updateOptions[ops.propName] = ops.value;
    }

    // Querying db to update some props of the product with the given id
    Product.update({ _id: id }, { $set: updateOptions })
        .exec()
        // Sending the json info about the update
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product updated',
                url: `http://localhost:3000/products/${id}`
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// DELETE aka Delete (wow)
router.delete('/:productId', (req, res, next) => {
    // Extracting product id from request url
    const id = req.params.productId;

    // Querying db to delete a record with this id
    Product.remove({ _id: id })
        .exec()
        // Sending the json info about the operation
        .then(result => {
            res.status(200).json({
                message: 'Product was deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
