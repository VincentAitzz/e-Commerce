const connection = require('../config/db');

exports.getLogin = (req, res) => {
    res.render('login');
};

exports.postLogin = async (req, res) => {
    const user = req.body.user;
    const pass = req.body.password;

    if(user && pass){
        connection.query('SELECT * FROM usuarios WHERE nombre = ?',[user], async (error, results)=>{
            if (error) {
                console.error(error);
                res.status(500).send('Error al iniciar sesión');
            } else if (results.length === 0 || pass !== results[0].password) {
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "USUARIO y/o PASSWORD incorrectas",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            } else {
                req.session.loggedin = true;
                req.session.name = results[0].nombre;
                res.render('login', {
                    alert: true,
                    alertTitle: "Conexión exitosa",
                    alertMessage: "¡LOGIN CORRECTO!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                });
            }
            res.end();
        });
    }
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

