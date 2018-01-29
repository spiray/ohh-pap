const nodemailer = require('nodemailer'),
    keys = require('../config/keys'),
    path = require('path'),
    home = path.join(__dirname, '../index.html'),
    calc = path.join(__dirname, '../html/calc.html'),
    priceList = path.join(__dirname, '../html/PriceList.html'),
    reports = path.join(__dirname, '../html/ProductivityReports.html'),
    locationPars = path.join(__dirname, '../html/LocationPars.html'),
    priceTable = path.join(__dirname, '../public/data/pricetable.csv'),
    fetch = require('node-fetch');

module.exports = app => {
    //Home Route
    app.get('/', (req, res) => {
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

    app.post('/getGeoWeather', (req, res) => {
        let lat = 40.0519037;
        let lon = -74.1768297;
        // let lat = req.body.coords.latitude;
        // let lon = req.body.coors.logitude;
        const APIKey = keys.weatherAPI;
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${APIKey}`)
            .then(response => response.json())
            .then(data => res.send(data))
            .catch(err => console.log(err));
        console.log('Weather Sent...');
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
}