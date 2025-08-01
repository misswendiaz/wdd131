// === FOOTER DATE AND TIME ===

// Get the current year
const currentYear = new Date().getFullYear();

// Insert the current year into the footer
document.getElementById("currentyear").textContent = currentYear;

// Get last modified date of the document
const rawDate = new Date(document.lastModified);

// Format the last modified date as full date and 24-hour time
const formatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
    hour12: false
});

// Format and display the last modified date
const formattedDate = formatter.format(rawDate);
document.getElementById("lastModified").textContent += formattedDate;





// === DISPLAY FORM ENTRIES ===

// Parse submitted form data from query string
const params = new URLSearchParams(window.location.search);

// Grab the container for entries display
const summary = document.getElementById("entries");

// Array to collect checked checkbox features
const features = [];

// Loop through each form field
params.forEach((value, key) => {
    // Handle grouped checkboxes
    if (key === "durability" || key === "ease" || key === "performance" || key === "design") {
        features.push(value);
    } else {
        // Display each form field as a paragraph
        const p = document.createElement("p");
        p.innerHTML = `<strong>${key}:</strong> ${value}`;
        summary.appendChild(p);
    }
});

// Display grouped features (if any)
if (features.length > 0) {
    const p = document.createElement("p");
    p.innerHTML = `<strong>Useful Features:</strong> ${features.join(", ")}`;
    summary.appendChild(p);
});





// === LOCALSTORAGE REVIEW COUNTER ===

// Get current review count from localStorage
let reviewCount = localStorage.getItem("reviewCount");

// Initialize if not set yet
if (!reviewCount) {
    reviewCount = 0;
}

// Increment count
reviewCount = Number(reviewCount) + 1;

// Save updated count
localStorage.setItem("reviewCount", reviewCount);

// Show review count at the top of the summary
const counterDisplay = document.createElement("p");
counterDisplay.innerHTML = `<strong>You’ve submitted ${reviewCount} review${reviewCount !== 1 ? "s" : ""}!</strong>`;
summary.prepend(counterDisplay);
