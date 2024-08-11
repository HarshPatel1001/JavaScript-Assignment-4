const apiKey = "2c04e27ec189fdc815d314e5d48781ba"; // OpenWeather API key
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="; // OpenWeather API URL for current weather
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q="; // OpenWeather API URL for weather forecast
const googleApiKey = "AIzaSyCH5Af2wrzkkaEtQxM-EiEVzdfQWeq6eh8"; // Google Maps API key
const googleMapUrl = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initMap`; // Google Maps API URL with callback to initMap function

const searchBox = document.querySelector(".search input"); // Input field for city name
const searchBtn = document.querySelector(".search button"); // Search button
const weatherIcon = document.querySelector(".weather-icon"); // Weather icon element
const mapElement = document.getElementById('map'); // Map element

// Function to check the weather for a given city
async function checkWeather(city) {
    // Fetch current weather data
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    // Fetch weather forecast data
    const forecastResponse = await fetch(forecastApiUrl + city + `&appid=${apiKey}`);

    // Check if the city is found
    if (response.status == 404) {
        document.querySelector(".error").style.display = "block"; // Show error message
        document.querySelector(".weather").style.display = "none"; // Hide weather display
        document.querySelector(".forecast").style.display = "none"; // Hide forecast display
    } else {
        var data = await response.json(); // Parse the weather data
        var forecastData = await forecastResponse.json(); // Parse the forecast data

        // Display weather details
        document.querySelector(".city").innerHTML = data.name; // Display city name
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c"; // Display temperature
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%"; // Display humidity
        document.querySelector(".wind").innerHTML = data.wind.speed + "km/h"; // Display wind speed

        // Set the weather icon based on the current weather
        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "images/clear.png";
        } else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "images/rain.png";
        } else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        } else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "images/mist.png";
        }

        document.querySelector(".weather").style.display = "block"; // Show weather display
        document.querySelector(".error").style.display = "none"; // Hide error message

        // Display the current date
        const dateElement = document.querySelector(".date");
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.innerHTML = now.toLocaleDateString('en-US', options);

        // Update the map with the weather location
        const position = { lat: data.coord.lat, lng: data.coord.lon };

        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 10,
            center: position,
            mapId: "DEMO_MAP_ID",
        });

        const marker = new google.maps.Marker({
            map,
            position: position,
            title: 'Weather Location',
        });

        updateForecast(forecastData); // Update the forecast display
    }
}

// Function to update the forecast display
function updateForecast(forecastData) {
    const forecastContainer = document.querySelector('.forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous forecast data

    // Filter the forecast data to get daily readings at 12:00 PM
    const dailyData = forecastData.list.filter((reading) => reading.dt_txt.includes("12:00:00"));

    // Display the forecast for each day
    dailyData.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('forecast-day');
        dayElement.innerHTML = `
            <h4>${new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'long' })}</h4>
            <img src="images/${day.weather[0].main.toLowerCase()}.png" alt="${day.weather[0].main}">
            <p>${Math.round(day.main.temp)}°c</p>
        `;
        forecastContainer.appendChild(dayElement);
    });

    document.querySelector(".forecast").style.display = "block"; // Show forecast display
}

// Add event listener to the search button
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value); // Check weather when the search button is clicked
});

// Display the current date when the page loads
window.onload = () => {
    const dateElement = document.querySelector(".date");
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.innerHTML = now.toLocaleDateString('en-US', options);
};

// Initialize the Google Map with a default position
function initMap() {
    const position = { lat: -25.344, lng: 131.031 };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: position,
        mapId: "DEMO_MAP_ID",
    });

    const marker = new google.maps.Marker({
        map,
        position: position,
        title: 'Weather Location',
    });
}

// Add passive event listeners for touch events
document.addEventListener('touchstart', function (event) {}, { passive: true });
document.addEventListener('touchmove', function (event) {}, { passive: true });
