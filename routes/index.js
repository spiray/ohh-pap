const express = require('express'),
    exphbs = require('express-handlebars'),
    nodemailer = require('nodemailer'),
    keys = require('../config/keys'),
    bodyParser = require('body-parser'),
    fetch = require('node-fetch'),
    JsonDB = require('node-json-db'),
    router = express.Router();

// Configure mailer
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
    }
});
// Home Route
router.get('/', (req, res) => res.render('home', { title: 'OHH Apps' }));

// Calc Route
router.get('/calc', (req, res) => res.render('calc', { title: 'PAP Calculator' }));

// Pricelist route
router.get('/price-list', (req, res) => res.render('price-list', { title: 'PAP Supply Pricing' }));

// Reports route
router.get('/prod-reports', (req, res) => res.render('prod-reports', { title: 'Productivity Reports' }));

// Location Pars route
router.get('/location-pars', (req, res) => res.render('location-pars', { class: 'map', title: 'Location Pars' }));

// Weather API request if browser navigation is enabled
router.post('/getGeoWeather', (req, res) => {
        let lat = req.body.latitude;
        let lon = req.body.longitude;
        const APIKey = keys.weatherAPI;
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
            return error;
        }
    })
    res.send('Email Sent...')
})
let db = new JsonDB('commentDB', true, true);
router.post('/setCommentData', (req, res) => {
    db.push('/comments/nsComment', `<br>${req.body.nsComment}`);
    db.push('/comments/resComment', `<br>${req.body.resComment}`);
    db.push('/comments/compComment', `<br>${req.body.compComment}`);
    db.push('/comments/schedComment', `<br>${req.body.schedComment}`);
    db.push('/comments/phoneComment', `<br>${req.body.phoneComment}`);
    res.send('Data pushed...')
})
router.get('/getCommentData', (req, res) => res.send(db.getData('/comments')));

module.exports = router;