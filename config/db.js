const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({path:'./config/.env'})

console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_DATABASE);

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión: ' + err.stack);
        return;
    }
    console.log('Conectado con el identificador ' + connection.threadId);
});

module.exports = connection;
