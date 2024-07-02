const connection = require('../config/db');

exports.getCart = (req, res) => {
    if (req.session.loggedin) {
        connection.query('SELECT p.*, c.cantidad FROM carrito c JOIN productos p ON c.producto_id = p.id WHERE c.usuario_id = ?', [req.session.userID], (error, cartItems) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error al obtener el carrito');
            } else {
                res.render('cart', {
                    companyName: 'Cloup_co',
                    companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                    name: req.session.name,
                    login: true,
                    cartItems: cartItems
                });
            }
        });
    } else {
        res.render('login', {
            companyName: 'Cloup_co',
            companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
            name: '',
            login: false
        });
    }
};

exports.addToCart = (req, res) => {
    if (req.session.loggedin) {
        const productId = req.body.productID;
        const quantity = req.body.quantity || 1;

        connection.query('INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)', [req.session.userID, productId, quantity], (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error al agregar al carrito');
            } else {
                res.render('cart', {
                    companyName: 'Cloup_co',
                    companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                    name: req.session.name,
                    login: true
                });
            }
        });
    } else {
        res.render('login', {
            companyName: 'Cloup_co',
            companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
            name: '',
            login: false
        });
    }
};

exports.removeFromCart = (req, res) => {
    if (req.session.loggedin) {
        const productId = req.body.productID;

        connection.query('DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?', [req.session.userID, productId], (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error al eliminar del carrito');
            } else {
                res.render('cart', {
                    companyName: 'Cloup_co',
                    companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                    name: req.session.name,
                    login: true
                });
            }
        });
    } else {
        res.render('login', {
            companyName: 'Cloup_co',
            companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
            name: '',
            login: false
        });
    }
};