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





const hamButton = document.querySelector("#menu");
const navigation = document.querySelector(".navigation");

hamButton.addEventListener("click", () => {
    navigation.classList.toggle("open");
    hamButton.classList.toggle("open");
});







const temples = [
    {
      templeName: "Aba Nigeria",
      location: "Aba, Nigeria",
      dedicated: "2005, August, 7",
      area: 11500,
      imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
    },
    {
      templeName: "Manti Utah",
      location: "Manti, Utah, United States",
      dedicated: "1888, May, 21",
      area: 74792,
      imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
    },
    {
      templeName: "Payson Utah",
      location: "Payson, Utah, United States",
      dedicated: "2015, June, 7",
      area: 96630,
      imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
    },
    {
      templeName: "Yigo Guam",
      location: "Yigo, Guam",
      dedicated: "2020, May, 2",
      area: 6861,
      imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
    },
    {
      templeName: "Washington D.C.",
      location: "Kensington, Maryland, United States",
      dedicated: "1974, November, 19",
      area: 156558,
      imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
    },
    {
      templeName: "Lima Perú",
      location: "Lima, Perú",
      dedicated: "1986, January, 10",
      area: 9600,
      imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
    },
    {
      templeName: "Mexico City Mexico",
      location: "Mexico City, Mexico",
      dedicated: "1983, December, 2",
      area: 116642,
      imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
    },
    {
        templeName: "Manila Philippines",
        location: "Quezon City, Philippines",
        dedicated: "1982, August, 25",
        area: 26683,
        imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manila-philippines/400x250/manila-philippines-temple-lds-129585-wallpaper.jpg"
    },
    {
        templeName: "Seoul Korea",
        location: "Seoul, South Korea",
        dedicated: "1983, May, 9",
        area: 28057,
        imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/seoul-korea/800x500/seoul-korea-temple-lds-424784-wallpaper.jpg"
    },
    {
        templeName: "Brisbane Australia",
        location: "Queensland, Australia",
        dedicated: "2001, May, 26",
        area: 10700,
        imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/brisbane-australia/320x200/brisbane-australia-temple-lds-901526-wallpaper.jpg"
      }
]

// Create temple cards and display them on the page
function createTempleCards(temples) {
    return temples.map(temple => {
        return `<div class="templeCard">
                    <h3>${temple.templeName}</h3>
                    <p>Located: ${temple.location}</p>
                    <p>Dedicated: ${temple.dedicated}</p>
                    <p>Size: ${temple.area} sq ft</p>
                    <img src="${temple.imageUrl}" alt="${temple.templeName}" loading="lazy" width="800" height="400">
                </div>`;
    }).join("");
}

// Insert the temple cards into the element with ID "templeCards"
document.getElementById("templeCards").innerHTML = createTempleCards(temples);


// Add event listener for the "Home" button to show all the temples
document.getElementById("Home").addEventListener("click", (e) => {
  e.preventDefault(); // prevent anchor default behavior
    getAllTemples();
});

// Show all temples
function getAllTemples() {
  document.getElementById("templeCards").innerHTML = createTempleCards(temples);
  document.getElementById("filter").innerHTML = `Home`
}

// Add event listener for the "Old" button to filter temples dedicated before 1900
document.getElementById("Old").addEventListener("click", (e) => {
  e.preventDefault(); // prevent anchor default behavior
    getOldTemples(1900);
});

// Filter temples dedicated before 1900
function getOldTemples() {
  const oldTemples = temples.filter(temple => {
    const dedicationYear = parseInt(temple.dedicated.split(",")[0]);
    return dedicationYear < 1900;
  });
  document.getElementById("templeCards").innerHTML = createTempleCards(oldTemples);
  document.getElementById("filter").innerHTML = `Old`
}

// Add event listener for the "New" button to filter temples dedicated after 2000
document.getElementById("New").addEventListener("click", (e) => {
  e.preventDefault(); // prevent anchor default behavior
    getNewTemples(2000);
});

// Filter temples dedicated after 2000
function getNewTemples() {
  const newTemples = temples.filter(temple => {
    const dedicationYear = parseInt(temple.dedicated.split(",")[0]);
    return dedicationYear > 2000;
  });
  document.getElementById("templeCards").innerHTML = createTempleCards(newTemples);
  document.getElementById("filter").innerHTML = `New`
}

// Add event listener for the "Large" button to filter temples with area larger than 90,000 square feet
document.getElementById("Large").addEventListener("click", (e) => {
  e.preventDefault(); // prevent anchor default behavior
    getLargeTemples(90000);
});

// Filter temples with area larger than 90,000 square feet
function getLargeTemples() {
  const largeTemples = temples.filter(temple => temple.area > 90000);
  document.getElementById("templeCards").innerHTML = createTempleCards(largeTemples);
  document.getElementById("filter").innerHTML = `Large`
}

// Add event listener for the "Small" button to filter temples with area smaller than 10,000 square feet
document.getElementById("Small").addEventListener("click", (e) => {
  e.preventDefault(); // prevent anchor default behavior
    getSmallTemples(10000);
});

// Filter temples with area larger than 90,000 square feet
function getSmallTemples() {
  const smallTemples = temples.filter(temple => temple.area < 10000);
  document.getElementById("templeCards").innerHTML = createTempleCards(smallTemples);
  document.getElementById("filter").innerHTML = `Small`
}