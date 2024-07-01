const db = require('../config/db');

class Producto {
  constructor(id, nombre, descripcion, precio, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.imagen = imagen;
  }

  static getUltimosProductos(limit, callback) {
    db.query('SELECT * FROM productos ORDER BY id DESC LIMIT ?', [limit], (err, rows) => {
      if (err) {
        callback(err, null);
      } else {
        const productos = rows.map(row => ({
          id: row.id,
          nombre: row.nombre,
          descripcion: row.descripcion,
          precio: row.precio,
          imagen: row.imagen
        }));
        callback(null, productos);
      }
    });
  }

  static getAllProductos(callback) {
    db.query('SELECT * FROM productos', (err, rows) => {
      if (err) {
        callback(err, null);
      } else {
        const productos = rows.map(row => ({
          id: row.id,
          nombre: row.nombre,
          descripcion: row.descripcion,
          precio: row.precio,
          imagen: row.imagen
        }));
        callback(null, productos);
      }
    });
  }
}

module.exports = Producto;