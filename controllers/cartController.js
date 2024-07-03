const connection = require('../config/db');

exports.getCart = (req, res) => {
    if (req.session.loggedin) {
        const userId = req.session.userID;

        // Obtener el carrito del usuario
        connection.query('SELECT c.id AS carrito_id, p.id AS producto_id, p.nombre, p.precio, p.imagen, cp.cantidad ' +
                        'FROM carrito c ' +
                        'JOIN carrito_productos cp ON c.id = cp.carrito_id ' +
                        'JOIN productos p ON cp.producto_id = p.id ' +
                        'WHERE c.usuario_id = ?', [userId], (error, cart) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error al obtener el carrito');
            } else {
                res.render('cart', {
                    companyName: 'Cloup_co',
                    companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                    name: req.session.name,
                    login: true,
                    cart: cart
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
        const userId = req.session.userID;
        const productId = req.body.productID;
        const quantity = req.body.quantity || 1;

        // Verificar si el usuario tiene un carrito existente
        connection.query('SELECT id FROM carrito WHERE usuario_id = ?', [userId], (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error al agregar al carrito');
            } else if (result.length > 0) {
                // El usuario tiene un carrito existente
                const cartId = result[0].id;
                req.session.cartId = cartId; // Asignar el cartId a la sesión

                // Verificar si el producto ya está en el carrito
                connection.query('SELECT * FROM carrito_productos WHERE carrito_id = ? AND producto_id = ?', [cartId, productId], (error, cartProduct) => {
                    if (error) {
                        console.error(error);
                        res.status(500).send('Error al agregar al carrito');
                    } else if (cartProduct.length > 0) {
                        // Actualizar la cantidad del producto en el carrito
                        connection.query('UPDATE carrito_productos SET cantidad = ? WHERE carrito_id = ? AND producto_id = ?', [cartProduct[0].cantidad + quantity, cartId, productId], (error, result) => {
                            if (error) {
                                console.error(error);
                                res.status(500).send('Error al agregar al carrito');
                            } else {
                                res.redirect('back');
                            }
                        });
                    } else {
                        // Agregar el producto al carrito
                        connection.query('INSERT INTO carrito_productos (carrito_id, producto_id, cantidad) VALUES (?, ?, ?)', [cartId, productId, quantity], (error, result) => {
                            if (error) {
                                console.error(error);
                                res.status(500).send('Error al agregar al carrito');
                            } else {
                                // Mostrar el modal de confirmación
                                res.redirect('back');
                            }
                        });
                    }
                });
            } else {
                // El usuario no tiene un carrito, crear uno nuevo
                connection.query('INSERT INTO carrito (usuario_id) VALUES (?)', [userId], (error, result) => {
                    if (error) {
                        console.error(error);
                        res.status(500).send('Error al agregar al carrito');
                    } else {
                        const cartId = result.insertId;
                        req.session.cartId = cartId; // Asignar el cartId a la sesión

                        // Agregar el producto al carrito recién creado
                        connection.query('INSERT INTO carrito_productos (carrito_id, producto_id, cantidad) VALUES (?, ?, ?)', [cartId, productId, quantity], (error, result) => {
                            if (error) {
                                console.error(error);
                                res.status(500).send('Error al agregar al carrito');
                            } else {
                                // Mostrar el modal de confirmación
                                res.redirect('back');
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.render('login', {
            
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
                res.redirect('back');
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