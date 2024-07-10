const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const dashboardController = require('../controllers/dashboardController');
const categoryController = require('../controllers/categoryController');
const dUserController = require('../controllers/dUsuariosController');


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
router.post('/cart/get-product-id', cartController.getProductIdByParams);
router.get('/cart/remove-from-cart', cartController.removeFromCart);

//Rutas de venta
router.post('/checkout', orderController.checkout);
router.get('/orderSummary/:orderId', orderController.getOrderSummary);
router.post('/confirm-delete-cart', orderController.confirmAndDeleteCart);

//Rutas del Dashboard
router.get('/dashboard', dashboardController.checkUserRoles, dashboardController.getDashboardData);
router.get('/dashboardUsuarios', dUserController.getDashboardUsuarios);
router.get('/usuarios/:id', dUserController.getUsuarioById);
router.post('/usuarios', dUserController.createUsuario);
router.post('/usuarios/:id/edit', dUserController.updateUsuario);
router.delete('/usuarios/:id', dUserController.deleteUsuario);

router.post('/dashboard/sales', dashboardController.updateSalesData);
router.post('/dashboard/orders', dashboardController.updateOrderData);
router.post('/dashboard/top-products', dashboardController.updateTopProductsData);
router.post('/dashboard/average-order', dashboardController.updateAverageOrderData);
router.post('/dashboard/top-categories', dashboardController.updateTopCategoriesData);
router.post('/dashboard/average-cart', dashboardController.updateAverageCartData);
router.post('/dashboard/customers', dashboardController.updateCustomerData);


module.exports = router;