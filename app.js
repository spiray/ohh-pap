// Import modules and init app
const express = require(`express`),
    exphbs = require(`express-handlebars`),
    path = require(`path`),
    bodyParser = require(`body-parser`);
//keys = require('./config/keys');

// Initialize App
const app = express();

// Load routes
const routes = require(`./routes/index`);

// Confirgure views engine
/* global __dirname */
app.set(`views`, `${__dirname}/views`);
const hbs = exphbs.create({
    defaultLayout: `main`,
    layoutsDir: `${__dirname}/views/layouts`
});
app.engine(`handlebars`, hbs.engine);
app.set(`view engine`, `handlebars`);

// Deliver static files
app.use(express[`static`](path.join(__dirname, `/dist/public`)));

// Configure Body parser to streamline HTTP requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Use routes
app.use(routes);

// Set port and listen on that port
/* global process */
app.set(`port`, (process.env.PORT || 5000));
app.listen(app.get(`port`), () => console.log(`App is running on port: ${app.get(`port`)}`));