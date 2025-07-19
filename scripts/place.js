let temperature = 29; // Celsius
let windSpeed = 15; // km/h

function calculateWindChill(temperature, windSpeed) {
    return Math.round(
        13.12 + 0.6215 * temperature -
        11.37 * (windSpeed ** 0.16) +
        0.3965 * temperature * (windSpeed ** 0.06));
}

if (temperature <= 10 && windSpeed > 4.8) {
    document.getElementById("wind-chill").textContent =
        calculateWindChill(temperature, windSpeed) + "°C";
} else {
    document.getElementById("wind-chill").textContent = "N/A";
}