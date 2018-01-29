//Import modules and intit app
const express = require('express');
const path = require('path');
const app = express();
const https = require('https');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const fs = require('fs');
const keys = require('./config/keys');

//Declare webpage paths
const
    home = path.join(__dirname, 'index.html'),
    calc = path.join(__dirname, 'html/calc.html'),
    priceList = path.join(__dirname, 'html/PriceList.html'),
    reports = path.join(__dirname, 'html/ProductivityReports.html'),
    locationPars = path.join(__dirname, 'html/LocationPars.html'),
    priceTable = path.join(__dirname, 'public/data/pricetable.csv');


//Confirgure environment
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//Deliver static files
app.use(express.static(path.join(__dirname, 'public')));

//Configure Body parser to streamline HTTP requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Dynamically include routes (Controller)
// fs.readdirSync('./controllers').forEach(file => {
//     if (file.substr(-3) == '.js') {
//         route = require('./controllers/' + file);
//         route.controller(app);
//     }
// });
//Home Route
app.get('/', (req, res) => {
    console.log(keys);
    res.sendFile(home);
});
app.get('/index.html', (req, res) => {
    res.sendFile(home);
});

//Calc Route
app.get('/html/calc.html', (req, res) => {
    res.sendFile(calc);
});

//Pricelist route
app.get('/html/PriceList.html', (req, res) => {
    res.sendFile(priceList);
});

//Reports route
app.get('/html/ProductivityReports.html', (req, res) => {
    res.sendFile(reports);
});

//Location Pars route
app.get('/html/LocationPars.html', (req, res) => {
    res.sendFile(locationPars);
});

//Send prictable.csv
app.get('/getPriceTable', (req, res) => {
        console.log('API hit...');
        res.sendFile(priceTable);
    })
    //Set port and listen on that port
app.set('port', (process.env.PORT || 8877));
app.listen(app.get('port'), () => {
    console.log('App is running...');
});

//Server side JS

app.post('/getGeoWeather', (req, res) => {
    let lat = 40.0519037;
    let lon = -74.1768297;
    console.log(req.body);
    // let lat = req.body.coords.latitude;
    // let lon = req.body.coors.logitude;
    const APIKey = keys.weatherAPI;
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${APIKey}`)
        .then(response => response.json())
        .then(data => res.send(data))
        .catch(err => console.log(err));
    console.log('Data Sent...');
    console.log(req.body);
})

let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    auth: {
        user: "joseph@oceanhomehealth.com",
        pass: keys.emailPass
    },
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: 'joseph@oceanhomehealth.com',
        pass: 'Hellopo1i'
    }
});
app.post('/emailContactForm', (req, res) => {
    console.log(req.body);
    let mailOptions = {
        from: `<joseph@oceanhomehealth.com>`,
        to: '<joseph@oceanhomehealth.com>',
        subject: `${req.body.name} - ${req.body.subject}`,
        html: `${req.body.body}</br>${req.body.name}`
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log(`Message Sent: ${info.response}`);
    })
    res.send('Email Sent...')
})