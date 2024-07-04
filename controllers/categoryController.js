const connection = require('../config/db');
const dashboardController = require('./dashboardController');

exports.getProductsByCategory = (req, res) => {
    const categoriaId = req.query.categoria;

    connection.query('CALL sp_get_products_by_category(?)', [categoriaId], (error, products) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error al obtener los productos');
        } else {
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
                                res.render('category', {
                                    companyName: 'Cloup_co',
                                    companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                                    name: req.session.name,
                                    login: true,
                                    roles: roles,
                                    products: products[0],
                                    categoriaId: categoriaId,
                                    categorias: categorias
                                });
                            })
                            .catch(error => {
                                console.error(error);
                                res.status(500).send('Error al obtener los roles');
                            });
                    } else {
                        res.render('category', {
                            companyName: 'Cloup_co',
                            companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                            name: '',
                            login: false,
                            products: products[0],
                            categoriaId: categoriaId,
                            categorias: categorias
                        });
                    }
                }
            });
        }
    });
};
