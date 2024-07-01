const Usuario = require('../models/Usuario');

exports.showLoginPage = (req, res) => {
    Usuario(5, (err, productos) => {
      if (err) {
        console.error('Error en loginController.showLoginPage:', err);
        res.render('login', { productos: [], usuario: req.session.user });
      } else {
        res.render('login', { productos, usuario: req.session.user });
      }
    });
  };