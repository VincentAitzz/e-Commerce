const connection = require('../config/db');
const cartController = require('./cartController');
const dashboardController = require('./dashboardController');
const homeController = require('./homeController');

exports.getLogin = (req, res) => {
    res.render('login');
};

exports.postLogin = async (req, res) => {
    const user = req.body.user;
    const password = req.body.password;

    connection.query('SELECT * FROM usuarios WHERE nombre = ?', [user], (error, users) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error al iniciar sesión');
        } else if (users.length > 0) {
            const user = users[0];
            if (user.password === password) {
                req.session.loggedin = true;
                req.session.userId = user.id;
                req.session.name = `${user.nombre} ${user.apellido}`;

                // Obtener o crear el carrito del usuario
                cartController.getOrCreateCart(user.id)
                    .then(cartId => {
                        req.session.cartId = cartId;

                        // Obtener los roles del usuario
                        dashboardController.getUserRoles(user.id)
                            .then(roles => {
                                req.session.roles = roles;
                                homeController.getTopSellingProducts()
                                    .then(featuredProducts => {
                                        // ... (código existente)
                                        res.render('index', {
                                            companyName: 'Cloup_co',
                                            companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                                            name: req.session.name,
                                            login: true,
                                            alert: true,
                                            alertTitle: "Conexión exitosa",
                                            alertMessage: "¡LOGIN CORRECTO!",
                                            alertIcon: 'success',
                                            showConfirmButton: false,
                                            timer: 1500,
                                            ruta: '',
                                            roles: req.session.roles,
                                            page: 'home',
                                            featuredProducts: featuredProducts
                                        });
                                    })
                                    .catch(error => {
                                        console.error(error);
                                        res.status(500).send('Error al obtener los productos destacados');
                                    });
                            })
                            .catch(error => {
                                console.error(error);
                                res.status(500).send('Error al iniciar sesión');
                            });
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).send('Error al iniciar sesión');
                    });
            } else {
                res.render('login', {
                    companyName: 'Cloup_co',
                    companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                    name: '',
                    login: false,
                    error: 'Correo electrónico o contraseña incorrectos'
                });
            }
        } else {
            res.render('login', {
                companyName: 'Cloup_co',
                companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                name: '',
                login: false,
                error: 'Correo electrónico o contraseña incorrectos'
            });
        }
    });
};

exports.getRegister = (req, res) => {
    res.render('register');
};

exports.postRegister = async (req, res) => {
    const user = req.body.user;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    //let passwordHaash = await bcryptjs.hash(password,10);
    connection.query('INSERT INTO usuarios SET ?',{nombre:user,apellido:lastName,email:email,password:password}, async(error, results)=>{
        if(error){
            console.log(error)
        }else{
            res.render('register', {
				alert: true,
				alertTitle: "Registration",
				alertMessage: "¡Successful Registration!",
				alertIcon:'success',
				showConfirmButton: false,
				timer: 1500,
				ruta: ''
			});
        }
    });
};

exports.logout = (req, res) => {
    if (req.session.loggedin) {
        // Destruir la sesión del usuario
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al cerrar sesión');
            } else {
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/');
    }
};

exports.getUserRoles = (userId) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT r.nombre AS rol ' +
                        'FROM usuarios_roles ur ' +
                        'JOIN roles r ON ur.rol_id = r.id ' +
                        'WHERE ur.usuario_id = ?', [userId], (error, roles) => {
            if (error) {
                reject(error);
            } else {
                resolve(roles.map(role => role.rol));
            }
        });
    });
};

