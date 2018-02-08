const express = require('express'),
    exphbs = require('express-handlebars'),
    nodemailer = require('nodemailer'),
    // keys = require('../config/keys'),
    bodyParser = require('body-parser'),
    fetch = require('node-fetch'),
    router = express.Router();

// Configure mailer
let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    auth: {
        user: "joseph@oceanhomehealth.com",
        pass: 'Hellopo1i' //keys.emailPass
    },
    tls: {
        ciphers: 'SSLv3'
    }
});
// Home Route
router.get('/', (req, res) => {
    res.render('home', {
        title: 'OHH Apps'
    });
});

// Calc Route
router.get('/calc', (req, res) => {
    res.render('calc', {
        title: 'PAP Calculator'
    });
});

// Pricelist route
router.get('/price-list', (req, res) => {
    res.render('price-list', {
        title: 'PAP Supply Pricing'
    });
});

// Reports route
router.get('/prod-reports', (req, res) => {
    res.render('prod-reports', {
        title: 'Productivity Reports'
    });
});

// Location Pars route
router.get('/location-pars', (req, res) => {
    res.render('location-pars', {
        class: 'map',
        title: 'Location Pars'
    });
});

// Send prictable.csv
router.get('/getPriceTable', (req, res) => {
        console.log('API hit...');
        res.send(path.join('../data/pricetable.csv'));
    })
    // Weather API request if browser navigation is enabled
router.post('/getGeoWeather', (req, res) => {
        let lat = req.body.latitude;
        let lon = req.body.longitude;
        const APIKey = '790e3bcb8a16e2395b51c9f39b7909f7'; //keys.weatherAPI;
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${APIKey}`)
            .then(response => response.json())
            .then(data => res.send(data))
            .catch(err => console.log(err));
    })
    // Weather API request if browser navigation is disabled
router.post('/getZipWeather', (req, res) => {
    let zip = req.body.zip;
    const APIKey = '790e3bcb8a16e2395b51c9f39b7909f7'; //keys.weatherAPI;
    fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zip},us&APPID=${APIKey}`)
        .then(response => response.json())
        .then(data => res.send(data))
        .catch(err => console.log(err));
})

router.post('/emailContactForm', (req, res) => {
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
    })
    res.send('Email Sent...')
})

module.exports = router;