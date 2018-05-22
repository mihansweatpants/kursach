const mongoose = require('mongoose');
const Product = require('../models/product');

exports.getAllProducts = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
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
};

exports.createProduct = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: `http://localhost:3000/${req.file.path}`
    });

    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created product successfuly',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
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
};

exports.getProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .then(doc => {
            if (doc) {
                console.log('From database', doc); // confirming that the record is being pulled from the db
            } else {
                res
                    .status(404)
                    .json({ message: 'No valid entry found for provided ID' });
            }
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
};

exports.updateProduct = (req, res, next) => {
    const id = req.params.productId;
    const updateOptions = {};
    for (const ops of req.body) {
        updateOptions[ops.propName] = ops.value;
    }

    Product.update({ _id: id }, { $set: updateOptions })
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
};

exports.deleteProduct = (req, res, next) => {
    const id = req.params.productId;

    Product.remove({ _id: id })
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
};
