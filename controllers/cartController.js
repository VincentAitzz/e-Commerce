const connection = require('../config/db');

exports.getCart = (req, res) => {
    // Lógica para obtener el carrito
    res.render('cart');
};

exports.addToCart = (req, res) => {
    // Lógica para agregar un producto al carrito
};

exports.removeFromCart = (req, res) => {
    // Lógica para eliminar un producto del carrito
};
