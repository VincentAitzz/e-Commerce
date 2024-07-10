const connection = require('../config/db');
const dashboardController = require('./dashboardController');

exports.getCart = (req, res) => {
  if (req.session.loggedin) {
    const userId = req.session.userId;

    dashboardController.getUserRoles(req.session.userId)
      .then(roles => {
        connection.query('SELECT c.id AS carrito_id, p.id AS producto_id, p.nombre, p.precio, p.imagen, cp.cantidad ' +
          'FROM carrito c ' +
          'JOIN carrito_productos cp ON c.id = cp.carrito_id ' +
          'JOIN productos p ON cp.producto_id = p.id ' +
          'WHERE c.usuario_id = ?', [userId], (error, cart) => {
            if (error) {
              console.error(error);
              res.status(500).send('Error al obtener el carrito');
            } else {
              // Obtener las categorías
              connection.query('SELECT * FROM categorias', (error, categorias) => {
                if (error) {
                  console.error(error);
                  res.status(500).send('Error al obtener las categorías');
                } else {
                  res.render('cart', {
                    companyName: 'Cloup_co',
                    companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
                    name: req.session.name,
                    login: true,
                    cart: cart,
                    roles: roles,
                    categorias: categorias
                  });
                }
              });
            }
          });
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Error al obtener los roles');
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

exports.getProductIdByParams = async (req, res) => {
  const { nombre, precio} = req.body;

  try {
    const product = await exports.getProductByParamsFromDB(nombre, precio);
    if (product) {
      req.session.productId = product.id; // Almacenar la ID del producto en la variable de sesión
      res.redirect('/cart/remove-from-cart');
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error('Error al buscar el producto:', error);
    res.status(500).send('Error al buscar el producto');
  }
};

exports.getProductByParamsFromDB = async (nombre, precio) => {
  console.log(nombre);
  console.log(precio);
  return new Promise((resolve, reject) => {
    connection.query('SELECT id FROM productos WHERE nombre = ? AND precio = ?', [nombre, precio], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result[0]);
      }
    });
  });
};

exports.addToCart = (req, res) => {
  if (req.session.loggedin) {
    const userId = req.session.userId;
    const productId = req.body.productId; // Usar el nombre correcto del parámetro
    const quantity = req.body.quantity || 1;
    const cartId = req.session.cartId;

    console.log('Producto: ' + productId)
    // Verificar si el producto existe en la tabla productos
    connection.query('SELECT id FROM productos WHERE id = ?', [productId], (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error al agregar al carrito');
      } else if (result.length === 0) {
        // El producto no existe en la tabla productos
        res.status(400).send('El producto no existe');
      } else {
        // Verificar si el producto ya está en el carrito
        connection.query('SELECT * FROM carrito_productos WHERE carrito_id = ? AND producto_id = ?', [cartId, productId], (error, cartProduct) => {
          if (error) {
            console.error(error);
            res.status(500).send('Error al agregar al carrito');
          } else if (cartProduct.length > 0) {
            // Actualizar la cantidad del producto en el carrito
            connection.query('UPDATE carrito_productos SET cantidad = cantidad + ? WHERE carrito_id = ? AND producto_id = ?', [quantity, cartId, productId], (error, result) => {
              if (error) {
                console.error(error);
                res.status(500).send('Error al agregar al carrito');
              } else {
                res.redirect('back');
              }
            });
          } else {
            // Agregar el producto al carrito
            connection.query('INSERT INTO carrito_productos (carrito_id, producto_id, cantidad) VALUES (?, ?, ?)', [cartId, productId, quantity], (error, result) => {
              if (error) {
                console.error(error);
                res.status(500).send('Error al agregar al carrito');
              } else {
                res.redirect('back');
              }
            });
          }
        });
      }
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

exports.removeFromCart = (req, res) => {
  if (req.session.loggedin) {
    const productId = req.session.productId;
    const cartId = req.session.cartId;

    console.log('idProducto: ' + productId);
    console.log('idCarrito: ' + cartId);

    connection.query('SELECT cantidad FROM carrito_productos WHERE carrito_id = ? AND producto_id = ?', [cartId, productId], (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error al obtener la cantidad del producto');
      } else if (result.length > 0) {
        const cantidad = result[0].cantidad;

        if (cantidad > 1) {
          // Actualizar la cantidad del producto en el carrito
          connection.query('UPDATE carrito_productos SET cantidad = cantidad - 1 WHERE carrito_id = ? AND producto_id = ?', [cartId, productId], (error, result) => {
            if (error) {
              console.error(error);
              res.status(500).send('Error al actualizar la cantidad del producto');
            } else {
              res.redirect('/cart');
            }
          });
        } else {
          // Eliminar el producto del carrito si la cantidad es 1
          connection.query('DELETE FROM carrito_productos WHERE carrito_id = ? AND producto_id = ?', [cartId, productId], (error, result) => {
            if (error) {
              console.error(error);
              res.status(500).send('Error al eliminar el producto del carrito');
            } else {
              res.redirect('/cart');
            }
          });
        }
      } else {
        res.status(404).send('Producto no encontrado en el carrito');
      }
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

exports.getOrCreateCart = (userId) => {
  return new Promise((resolve, reject) => {
    // Verificar si el usuario tiene un carrito existente
    connection.query('SELECT id FROM carrito WHERE usuario_id = ?', [userId], (error, result) => {
      if (error) {
        reject(error);
      } else if (result.length > 0) {
        // El usuario tiene un carrito existente
        resolve(result[0].id);
      } else {
        // El usuario no tiene un carrito, crear uno nuevo
        connection.query('INSERT INTO carrito (usuario_id) VALUES (?)', [userId], (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.insertId);
          }
        });
      }
    });
  });
};
