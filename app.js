//Import modules and init app
const express = require('express'),
    exphbs = require('express-handlebars'),
    path = require('path'),
    https = require('https'),
    bodyParser = require('body-parser'),
    fetch = require('node-fetch'),
    nodemailer = require('nodemailer'),
    fs = require('fs'),
    keys = require('./config/keys');

//Initialize App
const app = express();

//Confirgure environment
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handelbars');
// app.set('views', `${__dirname}/app/views`);

//Deliver static files
app.use(express.static(path.join(__dirname, 'public')));

//Configure Body parser to streamline HTTP requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Dynamically include routes
fs.readdirSync('./routes').forEach(file => {
    if (file == 'index.js') {
        require(`./routes/${file}`)(app, nodemailer, path, fetch, keys, exphbs);
        // route = require('./routes/' + file);
        // route.controller(app);
    }
});

//Set port and listen on that port
app.set('port', (process.env.PORT || 8877));
app.listen(app.get('port'), () => {
    console.log(`App is running on port: ${app.get('port')}`);
});