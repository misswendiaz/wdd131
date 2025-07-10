// get elements from the document
const radiusOutput = document.getElementById('radius');
const areaOutput = document.querySelector('#area');

let area = 0;
const PI = 3.14159;

// calculate the area of a circle with radius 10
// and update the output elements
let radius = 10;
area = PI * radius * radius;
radiusOutput.textContent = radius;
areaOutput.textContent = area;

radius = 20;
area = PI * radius * radius;
radiusOutput.textContent = radius;
areaOutput.textContent = area;