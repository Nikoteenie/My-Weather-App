/// Current Time Display
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day} ${hours}:${minutes}`;
}

// Weekly Forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return days[day];
}

/// Weekly Forecast
function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="container" id="forecast-wrapper">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        ` 
<div class="row align-items-start"" id="contained-forecast">
  <div class="col" id="weekday">${formatDay(forecastDay.dt)}</div>
  
  <div class="col"><img src="images/${
    forecastDay.weather[0].icon
  }.gif" alt="" id="image" width="30"></div>
   
   
  <div class="col"><span id="weekday-temp-max">
    ${Math.round(forecastDay.temp.max)}</span>°
    /
    <span id="weekday-temp-min">
      ${Math.round(forecastDay.temp.min)}°</span></div></div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "b6520355a84f46a27e6fe4523cdc2546";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displayForecast);
}
///

/// All reference for search results
function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon")
  

  fahrenheitTemperature = response.data.main.temp;


  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute("src", `images/${response.data.weather[0].icon}.gif`);
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);


}
/// Search Submission
function search(city) {
  let apiKey = "b6520355a84f46a27e6fe4523cdc2546";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

/// Current Location Button
function searchLocation(position) {
  let apiKey = "b6520355a84f46a27e6fe4523cdc2546";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displayTemperature);
}


/// Current Location Button
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}


// Conversion Button 
function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  let celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

/// Search Submission
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

/// Current Location Button
let currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

//Conversion Button
let fahrenheitTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("Miami");
