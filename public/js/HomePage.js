'use strict';

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

function preload() {
    //   Preload price table csv.
    priceTableH = select("#pricetable");
    if (priceTableH) {
        priceData = loadTable('data/pricetable.csv', 'csv', 'header');
    }
    //  Preload Branch Listing data into variable. 
    resultCard = select('.card');
    if (resultCard) {
        branchListing = loadTable('data/branchListing.csv', 'csv', 'header', undefined, response => console.log(response));
    }
}


function setup() {
    //  Set variables
    const addToDate = select('#addToDate'),
        dateSum = select('#dateSum'),
        dateInput = select('#dateInput'),
        dateInput2 = select('#dateInput2'),
        dateInput3 = select('#dateInput3'),
        dateInput4 = select('#dateInput4'),
        findLoc = select('.findLoc'),
        copyBtn = select('#copyToClip'),
        locationDisplay = select('#locationDisplay'),
        getWeather = select('#getWeather'),
        contactSubmit = select('#contact-submit'),
        placeholderJson = select('#placeholder-json');
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
    if (placeholderJson) {
        let posts = '';
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(data => {
                for (let post of data) {
                    posts += post.body;
                }
                placeholderJson.html(posts)
            })
            .catch(err => console.log(err));
    }
    if (addToDate) {
        addToDate.input(() => {
            dateValue = dateInput.value();
            let dat = moment(dateValue).add(addToDate.value(), 'day');
            dateSum.attribute("value", dat.calendar());
        });
    }
    if (dateInput) {
        dateInput.input(() => {
            if (addToDate.value() !== '') {
                dateValue = dateInput.value();
                let dat = moment(dateValue).add(addToDate.value(), 'day');
                dateSum.attribute("value", dat.calendar());
            }
        })
    }
    if (dateInput2) {
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
                        moment(`${month()}/${day()}/${year()}`)
                        .diff(dateInput2.value(), 'days')));
                }
            }
        });
    }
    if (dateInput4) {
        dateInput4.changed(() => {
            select('#Months').value(
                moment(dateInput4.value())
                .diff(dateInput3.value(), 'months'));
        });
    }
    if (dateInput3) {
        dateInput3.changed(() => {
            if (dateInput4.value()) {
                select('#Months').value(
                    moment(dateInput4.value())
                    .diff(dateInput3.value(), 'months'));
            }
        });
    }

    //  Functionality and event listeners for the branch listing. 
    if (zipSearch) {
        zipSearch.changed(() => {
            branchSearch();
        })
    }
    if (findLoc) {
        findLoc.mouseClicked(() => {
            branchSearch();
        })
    }
    if (copyBtn) {
        new Clipboard('#copyToClip');
        copyBtn.mouseClicked(() => {});
    }
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
            console.log(email);
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
}
const loadPriceTable = (tableForLoop) => {
    let tableHead = createElement('thead');
    let header = `<tr class="bg-primary">
                    <th>${priceData.columns[0]}</th>
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
        for (row of branchListing.rows) {
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
    if (hour() > 12) {
        hr = hour() - 12
    } else {
        hr = hour()
    }
    if (minute() < 10) {
        mn = `0${minute()}`;
    } else {
        mn = minute();
    }
    if (second() < 10) {
        scnd = `0${second()}`;
    } else {
        scnd = second();
    }
    if (hour() > 11) {
        time = `${hr}:${mn}:${scnd} PM`;
    } else {
        time = `${hr}:${mn}:${scnd} AM`;
    }
    todayIs.html(`${dayOfWeek} - ${month()}/${day()}/${year()} - ${time}`);
}

// Export variable for testing
// module.exports = {
//     priceData: priceData,
//     branchlisting: branchListing,
//     dateSum: dateSum
// };