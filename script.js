const API_URL = "https://api.openweathermap.org/data/2.5/forecast"; // Use forecast API
const API_KEY = "37f7537ebdfbd6893e4b93394289b508";

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Please enter a city name");
        return;
    }
    try {
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error("City not found");
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        alert(error.message);
    }
}

function displayWeather(data) {
    const cityName = document.getElementById("cityName");
    const currentDate = document.getElementById("currentDate");
    const currentTemp = document.getElementById("currentTemp");
    const weatherDescription = document.getElementById("weatherDescription");
    const realFeel = document.getElementById("realFeel");
    const windSpeed = document.getElementById("windSpeed");
    const humidity = document.getElementById("humidity");
    const forecastDays = document.querySelector(".forecast-days");
    const hourlySlots = document.querySelector(".hourly-slots");

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", { weekday: 'long', day: 'numeric', month: 'long' }); // Format the date

    cityName.textContent = `${data.city.name}, ${data.city.country}`;
    currentDate.textContent = formattedDate;
    currentTemp.textContent = `${Math.round(data.list[0].main.temp)} °C`; // Round temperature
    weatherDescription.textContent = data.list[0].weather[0].description;
    realFeel.textContent = `${Math.round(data.list[0].main.feels_like)} °C`; // Round real feel
    windSpeed.textContent = `${data.list[0].wind.speed} m/s`;
    humidity.textContent = `${data.list[0].main.humidity}%`;

    // Weekly forecast
    forecastDays.innerHTML = ""; // Clear previous forecast
    const dailyData = {};
    data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0]; // Get date part
        if (!dailyData[date]) {
            dailyData[date] = item; // Store the first entry for each day
        }
    });
    
    Object.values(dailyData).forEach(item => {
        const day = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
        const temp = Math.round(item.main.temp);
        const forecastDay = document.createElement("div");
        forecastDay.classList.add("forecast-day");
        forecastDay.innerHTML = `
            <div class="day">${day}</div>
            <div class="temp">${temp}°C</div>
        `;
        forecastDays.appendChild(forecastDay);
    });


    // Hourly forecast
    hourlySlots.innerHTML = ""; // Clear previous forecast
    for (let i = 0; i < 8; i++) { // Display next 8 hours
        const item = data.list[i];
        const time = item.dt_txt.split(" ")[1].slice(0, 5); // Get time
        const temp = Math.round(item.main.temp);
        const hourlySlot = document.createElement("div");
        hourlySlot.classList.add("hourly-slot");
        hourlySlot.innerHTML = `
            <div class="time">${time}</div>
            <div class="temp">${temp}°C</div>
        `;
        hourlySlots.appendChild(hourlySlot);
    }
}

const themeSwitch = document.getElementById("themeSwitch");

// Check saved theme
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-theme");
    themeSwitch.checked = true;
}

themeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("light-theme");
    localStorage.setItem("theme", document.body.classList.contains("light-theme") ? "light" : "dark");
});

// Initial weather fetch (optional - you might want to let the user search first)
getWeather();