//  Func to dynamically load item/price table.
export const loadPriceTable = (tableForLoop) => {
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
export const geoLocation = () => {
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
export const getWeather = position => {
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
export const branchSearch = () => {
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
export const getTime = () => {
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