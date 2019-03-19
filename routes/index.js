const express = require(`express`),
    nodemailer = require(`nodemailer`),
    {
        emailPass,
        weatherAPI
    } = require(`../config/keys`),
    fetch = require(`node-fetch`),
    JsonDB = require(`node-json-db`),
    router = express.Router();

// Configure mailer
const transporter = nodemailer.createTransport({
    host: `smtp-mail.outlook.com`,
    secureConnection: false,
    port: 587,
    auth: {
        user: `joseph@oceanhomehealth.com`,
        pass: emailPass
    },
    tls: {
        ciphers: `SSLv3`
    }
});
// Home Route
router.get(`/`, (req, res) => res.render(`home`, {
    title: `OHH Apps`
}));

// Calc Route
router.get(`/calc`, (req, res) => res.render(`calc`, {
    title: `PAP Calculator`
}));

// Pricelist route
router.get(`/price-list`, (req, res) => res.render(`price-list`, {
    title: `PAP Supply Pricing`
}));

// Reports route
router.get(`/prod-reports`, (req, res) => res.render(`prod-reports`, {
    title: `Productivity Reports`
}));

// Location Pars route
router.get(`/location-pars`, (req, res) => res.render(`location-pars`, {
    class: `map`,
    title: `Location Pars`
}));

// Weather API request if browser navigation is enabled
router.post(`/getGeoWeather`, async(req, res) => {
        const {
            latitude,
            longitude
        } = req.body;
        const APIKey = weatherAPI;
        try {
            const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${APIKey}`);
            const data = await response.json();
            res.send(data);
        } catch (err) {
            console.log(err);
        }
    })
    // Weather API request if browser navigation is disabled
router.post(`/getZipWeather`, async(req, res) => {
    const {
        zip
    } = req.body;
    const APIKey = `790e3bcb8a16e2395b51c9f39b7909f7`; //keys.weatherAPI;
    try {
        const repsonse = await fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zip},us&APPID=${APIKey}`);
        const data = await repsonse.json();
        res.send(data);
    } catch (err) {
        console.error(err)
    }
})

router.post(`/emailContactForm`, (req, res) => {
    const mailOptions = {
        from: `<joseph@oceanhomehealth.com>`,
        to: `<joseph@oceanhomehealth.com>`,
        subject: `${req.body.name} - ${req.body.subject}`,
        html: `${req.body.body}</br>${req.body.name}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return error;
        }
    })
    res.send(`Email Sent...`);
})
const db = new JsonDB(`commentDB`, true, true);
router.post(`/setCommentData`, (req, res) => {
    db.push(`/comments/nsComment`, `<br>${req.body.nsComment}`);
    db.push(`/comments/resComment`, `<br>${req.body.resComment}`);
    db.push(`/comments/compComment`, `<br>${req.body.compComment}`);
    db.push(`/comments/schedComment`, `<br>${req.body.schedComment}`);
    db.push(`/comments/phoneComment`, `<br>${req.body.phoneComment}`);
    res.send(`Data pushed...`)
})
router.get(`/getCommentData`, (req, res) => res.send(db.getData(`/comments`)));
/* global module */
module.exports = router;