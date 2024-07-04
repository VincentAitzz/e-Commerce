const connection = require('../config/db');

exports.checkUserRoles = (req, res, next) => {
    if (req.session.loggedin) {
        const userId = req.session.userId;

        // Obtener los roles del usuario
        exports.getUserRoles(userId)
            .then(roles => {
                // Verificar si el usuario tiene un rol permitido
                const allowedRoles = ['Administrador', 'Gerente', 'Supervisor'];
                const hasAllowedRole = roles.some(role => allowedRoles.includes(role));

                if (hasAllowedRole) {
                    req.session.roles = roles;
                    next(); // Continuar con la siguiente middleware o ruta
                } else {
                    res.render('error', {
                        message: 'No tienes permiso para acceder'
                    });
                }
            })
            .catch(error => {
                console.error(error);
                res.status(500).send('Error al verificar los roles');
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

exports.getDashboard = (req, res) => {
    // Mostrar la página del dashboard
    res.render('dashboard', {
        // ...
    });
};
