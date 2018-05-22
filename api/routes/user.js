const express = require('express');
const router = express.Router();

const checkAuth = require('../auth-middleware/check-auth');
const UserController = require('../controllers/user');

router.get('/:userLogin', checkAuth, UserController.getUser);
router.post('/signup', UserController.createUser);
router.post('/login', UserController.loginUser);
router.delete('/:userId', checkAuth, UserController.deleteUser);

module.exports = router;
