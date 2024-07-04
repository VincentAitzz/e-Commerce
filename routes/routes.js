const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const dashboardController = require('../controllers/dashboardController');
const categoryController = require('../controllers/categoryController');


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
router.get('/category', categoryController.getProductsByCategory);

// Rutas del carrito
router.get('/cart', cartController.getCart);
router.post('/cart/add', cartController.addToCart);
router.post('/cart/remove', cartController.removeFromCart);

//Rutas de venta
router.post('/checkout', orderController.checkout);
router.get('/orderSummary/:orderId', orderController.getOrderSummary);
router.post('/confirm-delete-cart', orderController.confirmAndDeleteCart);

//Rutas del Dashboard
router.get('/dashboard', dashboardController.checkUserRoles, dashboardController.getDashboard);


module.exports = router;