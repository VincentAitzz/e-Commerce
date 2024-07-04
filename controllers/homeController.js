const connection = require('../config/db');
const dashboardController = require('./dashboardController');

exports.getTopSellingProducts = () => {
    return new Promise((resolve, reject) => {
        connection.query('CALL sp_get_top_selling_products()', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
};

exports.getHome = (req, res) => {
    this.getTopSellingProducts()
        .then(featuredProducts => {
            if (req.session.loggedin) {
                // Obtener los roles del usuario
                dashboardController.getUserRoles(req.session.userId)
                    .then(roles => {
                        res.render('index', {
                            companyName: 'Cloup_co',
                            companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                            name: req.session.name,
                            login: true,
                            roles: roles,
                            featuredProducts: featuredProducts,
                            page: 'home'
                        });
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).send('Error al obtener los roles');
                    });
            } else {
                res.render('index', {
                    companyName: 'Cloup_co',
                    companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                    name: '',
                    login: false,
                    featuredProducts: featuredProducts,
                    page: 'home'
                });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error al obtener los productos destacados');
        });
};
