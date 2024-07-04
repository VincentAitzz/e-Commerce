const connection = require('../config/db');
const dashboardController = require('./dashboardController');

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

                    // Obtener las categorías
                    connection.query('SELECT * FROM categorias', (error, categorias) => {
                        if (error) {
                            console.error(error);
                            res.status(500).send('Error al obtener las categorías');
                        } else {
                            if (req.session.loggedin) {
                                // Obtener los roles del usuario
                                dashboardController.getUserRoles(req.session.userId)
                                    .then(roles => {
                                        res.render('product', {
                                            companyName: 'Cloup_co',
                                            companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                                            name: req.session.name,
                                            login: true,
                                            roles: roles,
                                            products: products,
                                            currentPage: page,
                                            totalPages: totalPages,
                                            categorias: categorias,
                                            page: 'product'
                                        });
                                    })
                                    .catch(error => {
                                        console.error(error);
                                        res.status(500).send('Error al obtener los roles');
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
                                    categorias: categorias,
                                    page: 'product'
                                });
                            }
                        }
                    });
                }
            });
        }
    });
};
exports.getProductsByCategory = (req, res) => {
    const categoriaId = req.query.categoria || req.body.categoria;

    connection.query('CALL sp_get_products_by_category(?)', [categoriaId], (error, products) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error al obtener los productos');
        } else {
            if (req.session.loggedin) {
                // Obtener los roles del usuario
                dashboardController.getUserRoles(req.session.userId)
                    .then(roles => {
                        res.render('product_by_category', {
                            companyName: 'Cloup_co',
                            companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                            name: req.session.name,
                            login: true,
                            roles: roles,
                            products: products[0],
                            categoriaId: categoriaId,
                            page: 'product'
                        });
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).send('Error al obtener los roles');
                    });
            } else {
                res.render('product_by_category', {
                    companyName: 'Cloup_co',
                    companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                    name: '',
                    login: false,
                    products: products[0],
                    categoriaId: categoriaId,
                    page: 'product'
                });
            }
        }
    });
};