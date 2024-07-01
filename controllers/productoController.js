const Producto = require('../models/Producto');

exports.showProductsPage = (req, res) => {
  Producto.getAllProductos((err, productos) => {
    if (err) {
      console.error('Error en productoController.showProductsPage:', err);
      res.render('productos', { error: 'Error al obtener los productos' });
    } else {
      res.render('productos', { productos, usuario: req.session.user });
    }
  });
};