// Course data represented as an object
let aCourse = {
    code: "WDD131",  // Course code
    title: "Dynamic Web Fundamentals",  // Course title
    credits: 2,  // Number of credits
    sections: [  // Array of section objects
        { section: "003", isEnrolled: 95, instructor: "Pedro Muniz" },
        { section: "002", isEnrolled: 80, instructor: "Roberto Diaz" }
    ]
};

// Function to update the course name in the table caption
function setCourseInformation(course) {
    // Select the element with ID 'courseName' and insert course code and title
    document.querySelector("#courseName").innerHTML = `${course.code} - ${course.title}`;
}

// Function to create a table row HTML for each section
function sectionTemplate(section) {
    // Return a string representing a row in the table with section details
    return `<tr>
            <td>${section.section}</td>  <!-- Section number -->
            <td>${section.isEnrolled}</td>  <!-- Number of enrolled students -->
            <td>${section.instructor}</td>  <!-- Instructor name -->
            </tr>`;
}

// Function to render all course sections into the table body
function renderSections(course) {
    // Map each section to an HTML row using the sectionTemplate function
    const html = course.sections.map(sectionTemplate);

    // Join all rows into one string and inject into the table body
    document.querySelector("#sections tbody").innerHTML = html.join("");
}

// When the DOM is fully loaded, populate the course data into the table
document.addEventListener("DOMContentLoaded", () => {
    setCourseInformation(aCourse);  // Set the course name in the caption
    renderSections(aCourse);        // Render all the course sections in the table
});
