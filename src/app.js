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
<div class="row" id="contained-forecast">
  <div class="col" id="weekday">${formatDay(forecastDay.dt)}</div>
   <div class="col" id="image"><img src="http://openweathermap.org/img/wn/${
     forecastDay.weather[0].icon
   }@2x.png" width="50"/></div>
   <div id="weekday-temps">
    <div class="col"><span id="weekday-temp-max">
    ${Math.round(forecastDay.temp.max)}</span>°
    /
    <span id="weekday-temp-min">
      ${Math.round(forecastDay.temp.min)}</span>°</div></div></div>`;
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
  let iconElement = document.querySelector("#icon");

  fahrenheitTemperature = response.data.main.temp;
  mhWind = response.data.wind.speed;

  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(mhWind);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

/// Search Submission
function search(city) {
  let apiKey = "b6520355a84f46a27e6fe4523cdc2546";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayTemperature);
}
/// Current Location Button
function searchLocation(position) {
  let apiKey = "b6520355a84f46a27e6fe4523cdc2546";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}
/// Current Location Button
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

//Conversion Button
function displayMetric(event) {
  event.preventDefault();

  let celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = Math.round(celsiusTemperature);

  let maxMetricTemperature = document.querySelector("#weekday-temp-max");
  let minMetricTemperature = document.querySelector("#weekday-temp-min");
  let unitShown = document.querySelector("#units");

  temperature.innerHTML = Math.round(celsiusTemperature);

  maxMetricTemperature.innerHTML = Math.round(celsiusTemperature);
  minMetricTemperature.innerHTML = Math.round(celsiusTemperature);
  unitShown.innerHTML = "°C";

  for (let i = 0; i < 6; i++) {
    fmax = Math.round(forecast[i].temp.max);
    fmin = Math.round(forecast[i].temp.min);
    maxMetricTemperature = Math.round((fmax - 32) * 5) / 9;
    minMetricTemperature = Math.round((fmax - 32) * 5) / 9;
    let forecastHigh = document.querySelectorAll("#weekday-temp-max")[i];
    forecastHigh.innerHTML = maxMetricTemperature;
    let forecastLow = document.querySelectorAll("#weekday-temp-min")[i];
    forecastLow.innerHTML = minMetricTemperature;
  }
}
let fahrenheitTemperature = null;

/// Search Submission
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

/// Current Location Button
let currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

///Conversion Button
let conversionButton = document.querySelector("#conversion");
conversionButton.addEventListener("click", displayMetric);

search("Miami");
