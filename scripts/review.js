// === FOOTER DATE AND TIME ===

// Get the current year using JavaScript's Date object
const currentYear = new Date().getFullYear();

// Insert the current year into the span with ID "currentyear"
document.getElementById("currentyear").textContent = currentYear;

// Get the last modified timestamp of the HTML document
const rawDate = new Date(document.lastModified);

// Create a date formatter for full date and long 24-hour time (no AM/PM)
const formatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",   // e.g., Friday, August 1, 2025
    timeStyle: "long",   // e.g., 15:27:33 GMT+8
    hour12: false        // use 24-hour format
});

// Format the raw modified date and display it in the "lastModified" paragraph
const formattedDate = formatter.format(rawDate);
document.getElementById("lastModified").textContent += formattedDate;

// === DISPLAY FORM ENTRIES ===

// Read the URL query string (e.g., ?name=John&feedback=Nice)
const params = new URLSearchParams(window.location.search);

// Get the <div id="entries"> to display the form data
const summary = document.getElementById("entries");

// Collect selected features in this array (durability, ease, etc.)
const features = [];

// Loop through each key-value pair in the query string
params.forEach((value, key) => {
    // If the key is one of the feature checkboxes, collect it in the array
    if (["durability", "ease", "performance", "design"].includes(key)) {
        features.push(key); // Store the key (not value) to show the feature name
    } else {
        // Otherwise, create a <p> tag to show the field
        const p = document.createElement("p");
        p.innerHTML = `<strong>${toTitleCase(key)}:</strong> ${value}`;
        summary.appendChild(p);
    }
});

// If any feature was selected, display them as a single entry
if (features.length > 0) {
    const p = document.createElement("p");
    p.innerHTML = `<strong>Useful Features:</strong> ${features.join(", ")}`;
    summary.appendChild(p);
}

// === LOCALSTORAGE REVIEW COUNTER ===

// Try to get the existing review count from localStorage
let reviewCount = localStorage.getItem("reviewCount");

// If nothing is found yet, initialize it to 0
if (!reviewCount) reviewCount = 0;

// Increment the count by 1
reviewCount = Number(reviewCount) + 1;

// Save the updated count back to localStorage
localStorage.setItem("reviewCount", reviewCount);

// Display the count at the top of the review summary
const counterDisplay = document.createElement("p");
counterDisplay.innerHTML = `<strong>You’ve submitted ${reviewCount} review${reviewCount !== 1 ? "s" : ""}!</strong>`;
summary.prepend(counterDisplay);

// === HELPER FUNCTION ===
// Converts camelCase or snake_case to a more readable Title Case
function toTitleCase(str) {
    return str
        .replace(/([A-Z])/g, " $1")              // add space before capital letters
        .replace(/[_\-]/g, " ")                  // replace underscores or dashes with space
        .replace(/\w\S*/g, txt =>                // capitalize first letter of each word
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
}
