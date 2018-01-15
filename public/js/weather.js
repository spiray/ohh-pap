let weather = select("#getWeather");

getLocation();

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        weather.html("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    weather.html("Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude);
    console.log(weather.html())
}