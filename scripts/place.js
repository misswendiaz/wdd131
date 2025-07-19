// Get the current year
const currentYear = new Date().getFullYear();

// Insert the current year into the element with ID "currentyear"
document.getElementById("currentyear").textContent = currentYear;

// Get the raw date when the document was last modified
const rawDate = new Date(document.lastModified);

// Create a date formatter for US English, with full date and 24-hour time
const formatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full", // e.g., Friday, July 4, 2025
    timeStyle: "long", // e.g. 21:21:25 GMT+8
    hour12: false // 24-hour format
})

// Format the raw date using the formatter
const formattedDate = formatter.format(rawDate);

// Insert the formated date string into the element with ID "lastModified"
document.getElementById("lastModified").textContent += formattedDate;




// Calculate and display the wind chill if applicable
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