const express = require('express');
const router = express.Router();
const multer = require('multer');

const getFormatedDate = require('../helpers/getFormatedDate');
const checkAuth = require('../auth-middleware/check-auth');
const ProductsController = require('../controllers/products');

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

const upload = multer({
    storage: storage,
    limits: {
        // принимаются файлы не более чем 5мб
        fileSize: 1024 * 1024 * 5
    }
});

router.post(
    '/',
    checkAuth,
    upload.single('productImage'),
    ProductsController.createProduct
);

router.get('/', ProductsController.getAllProducts);
router.get('/:productId', ProductsController.getProduct);
router.patch('/:productId', checkAuth, ProductsController.updateProduct);
router.delete('/:productId', checkAuth, ProductsController.deleteProduct);

module.exports = router;
