const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

exports.getAllOrders = (req, res, next) => {
    Order.find()
        .select('items products user _id')
        .populate('items products user')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        user: doc.user,
                        items: doc.items,
                        total: doc.total,
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
};

exports.createOrder = (req, res, next) => {
    User.find({ email: req.body.userEmail })
        .select('_id email login')
        .then(fetchedUser => {
            const currentUser = fetchedUser[0];
            Product.find()
                .select('name price _id productImage')
                .then(docs => {
                    const ids = [];

                    req.body.products.map(product => {
                        ids.push(product._id);
                    });

                    const cart = [];
                    ids.map(id =>
                        docs.forEach(doc => {
                            if (doc._id == id) {
                                cart.push(doc);
                            }
                        })
                    );

                    const total = cart
                        .map(function(a) {
                            return a.price;
                        })
                        .reduce(function(a, b) {
                            return a + b;
                        });

                    const order = new Order({
                        _id: mongoose.Types.ObjectId(),
                        user: currentUser,
                        items: cart,
                        total: total
                    });

                    return order.save();
                })
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Order created',
                        createdOrder: {
                            user: result.user,
                            items: result.items,
                            total: result.total
                        },
                        url: `http://localhost:3000/orders/${result._id}`
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
        });
};

exports.getOrder = (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('items _id')
        .populate('items product')
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
};

exports.deleteOrder = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};
