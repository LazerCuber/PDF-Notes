let notes = [];

// Save note and update the list
document.getElementById('save-note').addEventListener('click', function() {
    let noteText = document.getElementById('note-input').value;
    if (noteText) {
        notes.push(noteText);
        updateNoteList();
        document.getElementById('note-input').value = ''; // Clear input after saving
        saveNotesToLocalStorage(); // Save to localStorage
    }
});

// Update the note list and add delete buttons
function updateNoteList() {
    let noteList = document.getElementById('note-list');
    noteList.innerHTML = ''; // Clear the existing list
    notes.forEach(function(note, index) {
        let noteElement = document.createElement('p');
        noteElement.textContent = note;
        
        // Make the note clickable
        noteElement.style.cursor = 'pointer';
        noteElement.onclick = () => {
            document.getElementById('note-input').value = note; // Display note in text box
        };

        // Create delete button
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete'; // Add class for styling
        deleteButton.onclick = (e) => {
            e.stopPropagation(); // Prevent triggering the note click event
            notes.splice(index, 1); // Remove note from array
            updateNoteList(); // Refresh the note list
            saveNotesToLocalStorage(); // Update local storage
        };

        noteElement.appendChild(deleteButton); // Append delete button to note element
        noteList.appendChild(noteElement); // Append note element to note list
    });
}

// Load notes from localStorage on page load
window.addEventListener('load', function() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        updateNoteList(); // Update the note list with saved notes
    }
});

// Save notes to localStorage
function saveNotesToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Remove the separate load notes function since it's now automatic on page load