const connection = require('../config/db');

exports.getDashboardUsuarios = async (req, res) => {
    try {
        const usuarios = await exports.getAllUsuarios();
        res.render('dashboardUsuarios', { usuarios });
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).send('Error al obtener los usuarios');
    }
};

exports.getAllUsuarios = async () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM usuarios', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};
exports.getUsuarioById = async (req, res) => {
    const usuarioId = req.params.id;

    try {
        const usuario = await exports.getUsuarioByIdFromDB(usuarioId);
        res.json(usuario);
    } catch (error) {
        console.error(`Error al obtener el usuario con ID ${usuarioId}:`, error);
        res.status(500).send('Error al obtener el usuario');
    }
};
exports.getUsuarioByIdFromDB = async (usuarioId) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM usuarios WHERE id = ?', [usuarioId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
};
exports.createUsuario = async (req, res) => {
    const { nombre, apellido, email, password } = req.body;
  
    try {
      const nuevoUsuario = await exports.createUsuarioInDB(nombre, apellido, email, password);
      res.redirect('/dashboardUsuarios');
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      res.status(500).send('Error al crear el usuario');
    }
  };
exports.createUsuarioInDB = async (nombre, apellido, email, password) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'INSERT INTO usuarios (nombre, apellido, email, password) VALUES (?, ?, ?, ?)',
            [nombre, apellido, email, password],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.insertId);
                }
            }
        );
    });
};

exports.updateUsuario = async (req, res) => {
    const usuarioId = req.params.id;
    const { nombre, apellido, email, password } = req.body;
  
    try {
      await exports.updateUsuarioInDB(usuarioId, nombre, apellido, email, password);
      res.redirect('/dashboardUsuarios');
    } catch (error) {
      console.error(`Error al actualizar el usuario con ID ${usuarioId}:`, error);
      res.status(500).send(`Error al actualizar el usuario con ID ${usuarioId}`);
    }
  };
  
  exports.updateUsuarioInDB = async (usuarioId, nombre, apellido, email, password) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, password = ? WHERE id = ?',
        [nombre, apellido, email, password, usuarioId],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  };

exports.deleteUsuario = async (req, res) => {
    const usuarioId = req.params.id;

    try {
        await exports.deleteUsuarioFromDB(usuarioId);
        res.status(200).send('Usuario eliminado exitosamente');
    } catch (error) {
        console.error(`Error al eliminar el usuario con ID ${usuarioId}:`, error);
        res.status(500).send(`Error al eliminar el usuario con ID ${usuarioId}`);
    }
};

exports.deleteUsuarioFromDB = async (usuarioId) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM usuarios WHERE id = ?', [usuarioId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};