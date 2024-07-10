const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes/routes');
const puerto = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret:'1234',
  resave: true,
  saveUninitialized: true
}));

app.use('/res', express.static('public'));
app.use('/res', express.static(__dirname + '/public'));

dotenv.config({ path: './config/.env' });

app.set('view engine', 'ejs');

app.use(routes);

app.listen(puerto, (req, res) => {
    console.log('Server en puerto ' + puerto);
});
