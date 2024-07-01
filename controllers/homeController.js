const connection = require('../config/db');

exports.getHome = (req, res) => {
    // Obtener los productos destacados mediante el procedimiento almacenado
    connection.query('CALL sp_get_top_selling_products()', (error, featuredProducts) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error al obtener los productos destacados');
        } else {
            // Manejar las variables que dependen del estado de inicio de sesión
            if (req.session.loggedin) {
                // Obtener los productos más vendidos solo si el usuario ha iniciado sesión
                connection.query('CALL sp_get_top_selling_products()', (error, topSellingProducts) => {
                    if (error) {
                        console.error(error);
                        res.status(500).send('Error al obtener los productos más vendidos');
                    } else {
                        res.render('index', {
                            companyName: 'Cloup_co',
                            companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                            name: req.session.name,
                            login: true,
                            featuredProducts: featuredProducts[0], // Asigna los resultados del procedimiento almacenado
                            topSellingProducts: topSellingProducts[0] // Asigna los resultados del procedimiento almacenado
                        });
                    }
                });
            } else {
                res.render('index', {
                    companyName: 'Cloup_co',
                    companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                    name: '',
                    login: false,
                    featuredProducts: featuredProducts[0], // Asigna los resultados del procedimiento almacenado
                    topSellingProducts: [] // Asigna un arreglo vacío si el usuario no ha iniciado sesión
                });
            }
        }
    });
};
