// Import modules and init app
const express = require('express'),
    exphbs = require('express-handlebars'),
    path = require('path'),
    https = require('https'),
    bodyParser = require('body-parser'),
    fetch = require('node-fetch'),
    nodemailer = require('nodemailer'),
    fs = require('fs'),
    keys = require('./config/keys');

// Initialize App
const app = express();

// Load routes
const routes = require('./routes/index');

// Confirgure views engine
app.set('views', `${__dirname}/views`);
let hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: `${__dirname}/views/layouts`
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Deliver static files
app.use(express.static(path.join(__dirname, 'public')));

// Configure Body parser to streamline HTTP requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use routes
app.use(routes);

// Set port and listen on that port
app.set('port', (process.env.PORT || 8877));
app.listen(app.get('port'), () => {
    console.log(`App is running on port: ${app.get('port')}`);
});