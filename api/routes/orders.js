const express = require('express');
const router = express.Router();
const checkAuth = require('../auth-middleware/check-auth');

const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.getAllOrders);
router.post('/', checkAuth, OrdersController.createOrder);
router.get('/:orderId', checkAuth, OrdersController.getOrder);
router.delete('/:orderId', checkAuth, OrdersController.deleteOrder);

module.exports = router;
