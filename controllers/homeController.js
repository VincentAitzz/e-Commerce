const connection = require('../config/db');

exports.getHome = (req, res) => {
    connection.query('CALL sp_get_top_selling_products()', (error, featuredProducts) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error al obtener los productos destacados');
        } else {
            if (req.session.loggedin) {
                    res.render('index', {
                        companyName: 'Cloup_co',
                        companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                        name: req.session.name,
                        login: true,
                        featuredProducts: featuredProducts[0],
                        page: 'home'
                    });
            } else {
                res.render('index', {
                    companyName: 'Cloup_co',
                    companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                    name: '',
                    login: false,
                    featuredProducts: featuredProducts[0], 
                    page: 'home'
                });
            }
        }
    });
};
