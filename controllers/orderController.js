const connection = require('../config/db');

exports.checkout = (req, res) => {
    if (req.session.loggedin) {
        const userId = req.session.userID;
        const cartId = req.session.cartId;

        // Verificar si el carrito existe
        connection.query('SELECT id FROM carrito WHERE id = ?', [cartId], (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error al procesar la venta');
            } else if (result.length === 0) {
                // El carrito no existe, redirigir al usuario al carrito
                console.log("CarroInexistente")
                res.redirect('/cart');
            } else {
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
                // Calcular el total de la venta
                const total = orderData.reduce((acc, item) => acc + item.total, 0);

                res.render('orderSummary', {
                    companyName: 'Cloup_co',
                    companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                    name: req.session.name,
                    login: true,
                    orderData: orderData,
                    total: total,
                    cartId: req.session.cartId // Pasar el cartId a la plantilla
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
    const cartId = req.body.cartId;
    const confirm = req.body.confirm === 'true';

    connection.query('CALL sp_confirm_and_delete_cart(?, ?)', [cartId, confirm], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error al eliminar el carrito');
        } else {
            res.sendStatus(200);
        }
    });
};