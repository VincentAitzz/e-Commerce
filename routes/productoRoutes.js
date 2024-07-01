const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.get('/', productoController.showProductsPage);

module.exports = router;