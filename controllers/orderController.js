const connection = require('../config/db');

exports.checkout = (req, res) => {
    if (req.session.loggedin) {
        const userId = req.session.userId;
        const cartId = req.session.cartId;

        console.log(req.session.cartId)
        // Insertar la información de la venta en la tabla 'ventas'
        connection.query('INSERT INTO ventas (fecha, usuario_id, carrito_id) VALUES (?, ?, ?)', [new Date(), userId, cartId], (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error al procesar la venta');
            } else {
                const orderId = result.insertId;
                res.redirect(`/orderSummary/${orderId}`);
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


exports.getOrderSummary = (req, res) => {
    if (req.session.loggedin) {
        const orderId = req.params.orderId;
        console.log(orderId);

        // Verificar si la venta existe
        connection.query('SELECT * FROM ventas WHERE id = ?', [orderId], (error, ventas) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error al obtener la información de la venta');
            } else if (ventas.length === 0) {
                // La venta no existe, redirigir al usuario a una página de error
                console.log('Manito, no existe la venta');
                res.render('error', {
                    message: 'La venta no existe'
                });
            } else {
                // Obtener la información de la venta y los productos del carrito
                connection.query('SELECT p.nombre, p.precio, cp.cantidad, (p.precio * cp.cantidad) AS total ' +
                                'FROM ventas v ' +
                                'JOIN carrito c ON v.carrito_id = c.id ' +
                                'JOIN carrito_productos cp ON c.id = cp.carrito_id ' +
                                'JOIN productos p ON cp.producto_id = p.id ' +
                                'WHERE v.id = ?', [orderId], (error, orderData) => {
                    if (error) {
                        console.error(error);
                        res.status(500).send('Error al obtener la información de la venta');
                    } else {
                        console.log('orderData:', orderData);

                        // Calcular el total de la venta
                        const total = orderData.reduce((acc, item) => acc + item.total, 0);
                        console.log('total:', total);

                        res.render('orderSummary', {
                            companyName: 'Cloup_co',
                            companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                            name: req.session.name,
                            login: true,
                            orderData: orderData,
                            total: total,
                            cartId: req.session.cartId
                        });
                    }
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

exports.confirmAndDeleteCart = (req, res) => {
    const userId = req.session.userId;
    const cartId = req.body.cartId;
    const confirm = req.body.confirm === 'true';

    // Verificar si el carrito pertenece al usuario actual
    connection.query('SELECT id FROM carrito WHERE id = ? AND usuario_id = ?', [cartId, userId], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error al eliminar el carrito');
        } else if (result.length === 0) {
            // El carrito no pertenece al usuario actual, no se puede eliminar
            res.sendStatus(403); // Enviar código de estado 403 Forbidden
        } else {
            // Llamar al procedimiento almacenado para eliminar el carrito
            connection.query('CALL sp_confirm_and_delete_cart(?, ?)', [cartId, confirm], (error, result) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Error al eliminar el carrito');
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
};
