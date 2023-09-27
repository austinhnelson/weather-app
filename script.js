const apiKey = 'dc6d5ae5685231f2230e2d18683c12d1';
const loookupButton = document.querySelector('.lookup-button');
const todayInfo = document.querySelector('.todays-information');
const todayWeatherIcon = document.querySelector('.temperature-info i');
const todayTemp = document.querySelector('.temperature-info > .temperature');
const daysList = document.querySelector('.days-list');

const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water'
}

function fetchWeatherData(location) {
    const apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + location + '&appid=' + apiKey + '&units=metric';

    fetch(apiURL).then(response => response.json()).then(data => {
        const todayWeather = data.list[0].weather[0].description;
        const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
        const todayWeatherIconCode = data.list[0].weather[0].icon;

        todayInfo.querySelector('h4').textContent = new Date().toLocaleDateString('en', { weekday: 'long' });
        todayInfo.querySelector('.date').textContent = new Date().toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' });
        todayWeatherIcon.className = `ri-${weatherIconMap[todayWeatherIconCode]}-line`;
        todayTemp.textContent = todayTemperature;

        const locationElement = document.querySelector('.todays-information > div > span');
        locationElement.textContent = `${data.city.name}, ${data.city.country}`;

        const weatherDescriptionElement = document.querySelector('.temperature-info > .weather');
        weatherDescriptionElement.textContent = todayWeather;

        const todayPrecipitation = `${data.list[0].pop}%`;
        const todayHumidity = `${data.list[0].main.humidity}%`;
        const todayWindSpeed = `${data.list[0].wind.speed} km/h`;

        const dayInfoContainer = document.querySelector('.weather-info');
        dayInfoContainer.innerHTML = `
            <div>
                <span class="title">Precipitation</span>
                <span class="value">${todayPrecipitation}</span>
            </div>
            <div>
                <span class="title">Humidity</span>
                <span class="value">${todayHumidity}</span>
            </div>
            <div>
                <span class="title">Wind Speed</span>
                <span class="value">${todayWindSpeed}</span >
            </div >
            `;

        const today = new Date();
        const nextDaysData = data.list.slice(1);
        const uniqueDays = new Set();
        let count = 0;
        daysList.innerHTML = '';
        for (const dayData of nextDaysData) {
            const forecastDate = new Date(dayData.dt_txt);
            const dayAbbrev = forecastDate.toLocaleDateString('en', { weekday: 'short' });
            const dayTemp = `${Math.round(dayData.main.temp)}°C`;
            const iconCode = dayData.weather[0].icon;
            if (!uniqueDays.has(dayAbbrev) && forecastDate.getDate() !== today.getDate()) {
                uniqueDays.add(dayAbbrev);
                daysList.innerHTML += `
                <li>
                    <i class="ri-${weatherIconMap[iconCode]}-line"></i>
                    <div class="day">${dayAbbrev}</div>
                    <div class="day-temp">${dayTemp}</div>
                </li>
                `;
                count++;
            }
            if (count == 4) break;
        }

    }).catch(error => {
        alert(`Error fetching weather data: ${error} (API Error)`);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = 'Paris';
    fetchWeatherData(defaultLocation);
});

loookupButton.addEventListener('click', () => {
    const location = prompt('Enter a location');
    if (!location) return;

    fetchWeatherData(location);
});