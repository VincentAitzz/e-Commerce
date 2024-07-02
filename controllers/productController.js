const connection = require('../config/db');

exports.getProducts = (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1; // Obtener el número de página de la URL
    const limit = 10; // Número máximo de productos por página
    const offset = (page - 1) * limit; // Calcular el desplazamiento

    connection.query('SELECT * FROM productos LIMIT ? OFFSET ?', [limit, offset], (error, products) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error al obtener los productos');
        } else {
            // Obtener el número total de productos
            connection.query('SELECT COUNT(*) AS total FROM productos', (error, count) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Error al obtener el recuento de productos');
                } else {
                    const totalProducts = count[0].total;
                    const totalPages = Math.ceil(totalProducts / limit);

                    if (req.session.loggedin) {
                        res.render('product', {
                            companyName: 'Cloup_co',
                            companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                            name: req.session.name,
                            login: true,
                            products: products,
                            currentPage: page,
                            totalPages: totalPages,
                            page: 'product'
                        });
                    } else {
                        res.render('product', {
                            companyName: 'Cloup_co',
                            companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                            name: '',
                            login: false,
                            products: products,
                            currentPage: page,
                            totalPages: totalPages,
                            page: 'product'
                        });
                    }
                }
            });
        }
    });
};