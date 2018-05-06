const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product')
        .populate('product')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        url: `http://localhost:3000/orders/${doc._id}`
                    };
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: `Product with id ${req.body.productId} not found`
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order created',
                createdOrder: {
                    product: result.product,
                    quantity: result.quantity
                },
                url: `http://localhost:3000/orders/${result._id}`
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('product quantity _id')
        .populate('product')
        .exec()
        .then(order => {
            if (!order) {
                res.status(404).json({
                    message: `Order with id ${req.params.orderId} not found`
                });
            }
            res.status(200).json({
                order: order,
                allOrders: {
                    type: 'GET',
                    url: `http://localhost:3000/orders`
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:orderId', (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted'
            });
        })
        .catch();
});

module.exports = router;