//Import modules and init app
const express = require('express');
const path = require('path');
const app = express();
const https = require('https');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const fs = require('fs');
const keys = require('./config/keys');

//Confirgure environment
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', '');
//Deliver static files
app.use(express.static(path.join(__dirname, 'public')));

//Configure Body parser to streamline HTTP requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Dynamically include routes (Controller)
fs.readdirSync('./routes').forEach(file => {
    if (file == 'index.js') {
        require(`./routes/${file}`)(app);
        // route = require('./routes/' + file);
        // route.controller(app);
    }
});

//Set port and listen on that port
app.set('port', (process.env.PORT || 8877));
app.listen(app.get('port'), () => {
    console.log(`App is running on port: ${app.get('port')}`);
});