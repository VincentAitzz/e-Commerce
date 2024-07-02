const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');

router.get('/', homeController.getHome);

// Rutas de usuarios
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/register', userController.getRegister);
router.post('/register', userController.postRegister);
router.get('/logout', userController.logout);

// Rutas de productos
router.get('/product', productController.getProducts);
router.get('/product/:id', productController.getProducts);

// Rutas del carrito
router.get('/cart', cartController.getCart);
router.post('/cart/add', cartController.addToCart);
router.post('/cart/remove', cartController.removeFromCart);

module.exports = router;