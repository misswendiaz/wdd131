// Define an array of names
let names = ["Nancy", "Blessing", "Jorge", "Svetlana", "Bob"];

// Use filter to create a new array with names that start with the letter 'B'
namesB = names.filter(name => name.charAt(0) === 'B'); 
// charAt(0) gets the first character of the name
// Only "Blessing" and "Bob" start with 'B', so they are included

console.log(namesB); // Output: ["Blessing", "Bob"]

// Use map to create a new array that holds the length of each name
namesLength = names.map(name => name.length); 
// name.length returns the number of characters in each name
// Resulting array: [5, 8, 5, 8, 3]

console.log(namesLength); // Output: [5, 8, 5, 8, 3]

// Use reduce to sum up the lengths of all names, then divide by total names to get the average
namesAverageLength = names.reduce((total, name) => total + name.length, 0) / names.length; 
// reduce() starts with total = 0
// For each name, it adds name.length to total
// Final total = 5 + 8 + 5 + 8 + 3 = 29
// Divide 29 by number of names (5) → 29 / 5 = 5.8

console.log(namesAverageLength); // Output: 5.8
