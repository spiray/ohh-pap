//Import modules and intit app
const express = require('express');
const path = require('path');
const app = express();
const https = require('https');
const bodyParser = require('body-parser');

//Declare webpage paths
const
    home = path.join(__dirname, 'index.html'),
    calc = path.join(__dirname, 'html/calc.html'),
    priceList = path.join(__dirname, 'html/PriceList.html'),
    reports = path.join(__dirname, 'html/ProductivityReports.html'),
    locationPars = path.join(__dirname, 'html/LocationPars.html');

//Deliver static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Home Route
app.get('/', (req, res) => {
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

//Set port and listen on that port
app.set('port', (process.env.PORT || 8877));
app.listen(app.get('port'), () => {
    console.log('App is running...');
});

//Server side JS

app.post('/getWeather', (req, res) => {
    // let lat = req.body;
    // let lon = req.body;
    console.log('receiving data...');
    res.send('Hello');
    console.log('Data Sent...');
    // let lat = req.body.position.coords.latitude;
    // let lon = req.body.position.coords.longitude;
    // const APIKey = '790e3bcb8a16e2395b51c9f39b7909f7';
    // let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${APIKey}`;

    // https.get(url, res => {
    //     res.setEncoding('utf8');
    //     let weather = '';
    //     res.on('data', data => {
    //         weather += data;
    //     });
    //     res.on('end', () => {
    //         weather = JSON.parse(weather);
    //     })
    // })
})

//     })
// });
//     currentWeather = loadJSON(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${APIKey}`, () => {
//         locationDisplay.innerHTML = `${currentWeather.name} - ${round(currentWeather.main.temp * 9 / 5 - 459.67)} &#8457;
//                              <img width="26" height="26" src="http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png" />`;
//     }, response => console.error('Error in Weather API', response), 'jsonp');