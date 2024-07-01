const connection = require('../config/db');

exports.getProduct = (req, res) => {
    // Lógica para obtener un producto específico
    res.render('product');
};
