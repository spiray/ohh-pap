// Import internal functions
// import { loadPriceTable, geoLocation, getWeather, branchSearch, getTime } from './mainFunc.js';

//  Declare global variables
let dateValue,
    priceTableH,
    tableRow,
    todayIs,
    currentWeather,
    inTags,
    branchListing,
    currentZip,
    zipSearch,
    resultLoc,
    resultCard,
    priceData;

//  Declare and set constants
const prodHost = 'https://pure-escarpment-35043.herokuapp.com/',
    devHost = 'http://localhost:5000/';

function preload() {
    //   Preload price table csv.
    priceTableH = select("#pricetable");
    if (priceTableH) {
        priceData = loadTable('./data/pricetable.csv', 'csv', 'header', undefined, response => response);
    }
    //  Preload Branch Listing data into variable. 
    resultCard = select('.card');
    if (resultCard) {
        branchListing = loadTable('./data/branchListing.csv', 'csv', 'header', undefined, response => response);
    }
}

function setup() {
    // //  Declare and set constants
    const addToDate = select('#addToDate'),
        dateSum = select('#dateSum'),
        dateInput = select('#dateInput'),
        dateInput2 = select('#dateInput2'),
        dateInput3 = select('#dateInput3'),
        dateInput4 = select('#dateInput4'),
        findLoc = select('.findLoc'),
        copyBtn = select('#copyToClip'),
        locationDisplay = select('#locationDisplay'),
        // getWeather = select('#getWeather'),
        contactSubmit = select('#contact-submit');

    //Set variables
    zipSearch = select('.search');
    resultLoc = select('#resultLoc');

    //  Display time and update every second.
    getTime();
    setInterval(getTime, 1000 * 1);

    //  Load Price list data and load it into the HTML tableRow.
    if (priceTableH && priceData.columns[0] == 'id') {
        loadPriceTable(priceTableH);
    }

    //  Display weather and update every 30 seconds.
    geoLocation();
    setInterval(geoLocation, 1000 * 60 * 30);

    //  Functionality and event listeners for the calculator.
    if (window.location.href == `${devHost}calc` ||
        window.location.href == `${prodHost}calc`) {
        addToDate.input(() => {
            dateValue = dateInput.value();
            let dat = moment(dateValue).add(addToDate.value(), 'day');
            dateSum.attribute("value", dat.calendar());
        });

        dateInput.input(() => {
            if (addToDate.value() !== '') {
                dateValue = dateInput.value();
                let dat = moment(dateValue).add(addToDate.value(), 'day');
                dateSum.attribute("value", dat.calendar());
            }
        })
        dateInput2.changed(() => {
            inTags = selectAll('input');
            for (let i = 0; i < inTags.length; i++) {
                if (inTags[i].id().substring(0, 3) == 'Day' && inTags[i].id() !== 'DaysSince') {
                    inTags[i].attribute("value",
                        moment(dateInput2.value())
                        .add(parseInt(inTags[i].id().substring(3)), 'day')
                        .calendar());
                } else if (inTags[i].id() == 'Month15') {
                    inTags[i].value(
                        moment(dateInput2.value())
                        .add(15, 'months')
                        .calendar());
                } else if (inTags[i].id() == 'DaysSince') {
                    inTags[i].value((
                        moment(`${year()}-${month()}-${day()}`)
                        .diff(dateInput2.value(), 'days')));
                }
            }
        });
        dateInput4.changed(() => {
            select('#Months').value(
                moment(dateInput4.value())
                .diff(dateInput3.value(), 'months'));
        });
        dateInput3.changed(() => {
            if (dateInput4.value()) {
                select('#Months').value(
                    moment(dateInput4.value())
                    .diff(dateInput3.value(), 'months'));
            }
        });
    }

    //  Functionality and event listeners for the branch listing. 
    if (window.location.href == `${devHost}location-pars` ||
        window.location.href == `${prodHost}location-pars`) {
        zipSearch.changed(() => {
            branchSearch();
        })
        findLoc.mouseClicked(() => {
            branchSearch();
        })
        new Clipboard('#copyToClip');
        copyBtn.mouseClicked(() => {});
    }

    //Suggestion modal functionality
    CKEDITOR.replace('contactBody');
    if (contactSubmit) {
        contactSubmit.mouseClicked(() => {
            let closeModal = select('#close-modal');
            let name = select('#contactName').value();
            let subject = select('#contactSubject').value();
            let body = CKEDITOR.instances.contactBody.getData();
            let email = {
                name: name,
                subject: subject,
                body: body
            };
            fetch('/emailContactForm', {
                    method: 'POST',
                    headers: {
                        "Accept": "*/*",
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(email)
                })
                .then(response => response.text())
                .then(data => data);
        })
    }

    //Load comments for prod reports.
    if (window.location.href == `${devHost}prod-reports` ||
        window.location.href == `${prodHost}prod-reports`) {
        //Set reporting comments greeting
        const adminBtn = select('#admin-btn');
        const comments = selectAll('.comments');
        const greetingElements = selectAll('.greeting');
        if (greetingElements) {
            let greeting;
            greeting = hour() < 11 ? 'Good Morning,' : 'Good Afternoon,';
            for (let greetingElement of greetingElements) {
                greetingElement.html(greeting);
            }
        }
        const forms = selectAll('.comment-form');
        for (let form of forms) {
            CKEDITOR.replace(`${form.id()}`);
        }
        const saveBtn = select('#save-btn');
        saveBtn.mouseClicked(() => {
            let nsData = CKEDITOR.instances.nsForm.getData();
            let resData = CKEDITOR.instances.resForm.getData();
            let compData = CKEDITOR.instances.compForm.getData();
            let schedData = CKEDITOR.instances.schedForm.getData();
            let phoneData = CKEDITOR.instances.phoneForm.getData();
            let commentBody = {
                nsComment: nsData,
                resComment: resData,
                compComment: compData,
                schedComment: schedData,
                phoneComment: phoneData
            };
            fetch('/setCommentData', {
                    method: 'POST',
                    headers: {
                        "Accept": "*/*",
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(commentBody)
                })
                .then(res => res.text())
                .then(text => text)
                .catch(err => console.log(err));
            window.location.reload(true);
        })

        //Fetch all comments and display them.
        fetch('getCommentData')
            .then(res => res.json())
            .then(data => {
                comments[0].html(data.nsComment);
                comments[1].html(data.resComment);
                comments[2].html(data.compComment);
                comments[3].html(data.schedComment);
                comments[4].html(data.phoneComment);
            })
            .catch(err => console.log(err));
    }

    //Remove default canvas
    const unwantedCanvas = select('#defaultCanvas0');
    unwantedCanvas.remove();
}

//Function that loads the pricetable data into the html table.
const loadPriceTable = tableForLoop => {
    let tableHead = createElement('thead');
    let header = `<tr class="bg-dark theme-color">
                    <th>${priceData.columns[0].toUpperCase()}</th>
                    <th>${priceData.columns[1]}</th>
                    <th>${priceData.columns[2]}</th>
                    <th>${priceData.columns[3]}</th>
                    <th>${priceData.columns[4]}</th>
                  </tr>
                  <tr class="no-result warning">
                    <td colspan="4">No Results</td>
                  </tr>`;
    tableHead.html(header);
    tableHead.parent(tableForLoop);
    let tableBody = createElement('tbody');
    for (let i = 0; i < priceData.getRowCount(); i++) {
        tableRow = `<tr>
                         <th scope="row">${priceData.rows[i].arr[0]}</th>
                         <td>${priceData.rows[i].arr[1]}</td>
                         <td>${priceData.rows[i].arr[2]}</td>
                         <td>${priceData.rows[i].arr[3]}</td>
                         <td>${priceData.rows[i].arr[4]}</td>
                    </tr>`;
        tableBody.html(tableRow, true);
    }
    tableBody.parent(tableForLoop);
}

//  Function to test if browser supports geolocation and call Open Weather Map to get local weather or user entered location weather.
const geoLocation = () => {
    navigator.geolocation.getCurrentPosition(getWeather, err => {
        if (sessionStorage.getItem('zip')) {
            currentZip = sessionStorage.getItem('zip');
        } else {
            while (true) {
                currentZip = prompt('Please enter your zip code.');
                if (currentZip.length == 5) {
                    sessionStorage.setItem('zip', currentZip);
                    break;
                } else {
                    currentZip = prompt('Please enter your zip code.');
                }
            }
        }
        fetch('/getZipWeather', {
                method: 'POST',
                headers: {
                    "Accept": "*/*",
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ zip: currentZip })
            })
            .then(response => response.json())
            .then(data => {
                locationDisplay.innerHTML = `${data.name} - ${round(data.main.temp * 9 / 5 - 459.67)} &#8457;
                    <img width="26" height="26" src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" />`;
            });
    });
}

//  Callback func to call OpenWeatherMap for weather at given lon & lat.
const getWeather = position => {
    let geoCoords = position.coords;
    //  POST request to server side GET request.
    fetch('/getGeoWeather', {
            method: 'POST',
            headers: {
                "Accept": "*/*",
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                latitude: geoCoords.latitude,
                longitude: geoCoords.longitude
            })
        })
        .then(response => response.json())
        .then(data => {
            locationDisplay.innerHTML = `${data.name} - ${round(data.main.temp * 9 / 5 - 459.67)} &#8457;
                                             <img width="26" height="26" src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" />`
        })
        .catch(err => console.log(`API Error ${err}`));
}

//  Func to loop through a column in a csv file and return the corresponding Location if found. 
const branchSearch = () => {
    if (zipSearch.value().length !== 5) {
        resultLoc.html('Enter 5 digit zip code.')
    } else {
        for (let row of branchListing.rows) {
            if (row.arr[2] == zipSearch.value()) {
                resultLoc.html(row.arr[3]);
                break;
            } else {
                resultLoc.html('Location not found...');
            }
        }
    }
}

//  Func to to get day and time. 
const getTime = () => {
    todayIs = select('#todayIs');
    let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dayOfWeek = weekdays[new Date().getDay()];
    //   let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //   let monthName = months[month()];
    let hr,
        mn,
        scnd,
        time;
    hr = hour() > 12 ? hour() - 12 : hour();
    mn = minute() < 10 ? `0${minute()}` : minute();
    scnd = second() < 10 ? `0${second()}` : second();
    time = hour() > 11 ? `${hr}:${mn}:${scnd} PM` : `${hr}:${mn}:${scnd} AM`;
    todayIs.html(`${dayOfWeek} - ${month()}/${day()}/${year()} - ${time}`);
}

// Export variable for testing
// module.exports = {
//     priceData: priceData,
//     branchlisting: branchListing,
//     dateSum: dateSum
// };