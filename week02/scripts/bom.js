const input = document.querySelector("#favchap"); // Selects the HTML element with the id="favchap" — an <input> element where users type in their favorite chapter. Then, stores that reference in the input constant for easy access.
const button = document.querySelector("button"); // Selects the first <button> element in the document that will be used to trigger to add a chapter to the list.
const list = document.querySelector("#list") // Selects the first HTML element in the document with the id="list". This gives you a reference to the list container, so you can later add (appendChild) or remove (removeChild) <li> items dynamically.

button.addEventListener("click", function () { // Adds an event listener to the button that listens for click events. When the button is clicked, the function inside will execute.
    if (input.value.trim() !== "") {
        const li = document.createElement("li"); // Creates a new <li> (list item) element, but doesn't add it to the DOM yet. Prepares a new list item where the chapter name and delete button will go.
        const deleteButton = document.createElement("button"); // Creates a new <button> element to later be used for deleting the list item. Lets users remove chapters from the list.
        
        li.textContent = input.value; // Sets the text of the <li> element to the current value entered in the input box. This will be overridden soon by the next .append() calls unless structured properly.
        deleteButton.textContent = "❌"; // Sets the button’s label to a red cross emoji — a common delete symbol.
        li.append(deleteButton); // Adds the delete button inside the <li> so that it's part of the list item visually and functionally.
        list.append(li); // Adds the newly created <li> element as a child of the list element (e.g., a <ul> or <ol>). This uses append(), a modern DOM method that allows appending nodes or even strings.
        
        deleteButton.addEventListener("click", function () { // Adds an event listener to the delete button that listens for click events. When the button is clicked, the function inside will execute.
            list.removeChild(li); // Removes the <li> element from the list. This uses removeChild(), a method that removes a specified child node from the DOM.
            input.focus(); // Sets the focus back to the input field after deleting an item, so users can quickly add another chapter without having to click back into the input box.
        });

        input.value = ""; // Clears the input field after adding the chapter to the list, so users can easily type in a new chapter without having to delete the previous text.
        input.focus(); // Sets the focus back to the input field after adding an item, so
    }
});