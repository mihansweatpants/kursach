const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: {
        type: [
            {
                quantity: { type: Number, default: 1 },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                }
            }
        ]
    },
    total: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);
