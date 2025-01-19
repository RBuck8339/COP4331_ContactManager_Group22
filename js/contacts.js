const contacts_data = document.getElementById('contactsData');
const addContactWindow = document.getElementById('addContactModal');
const addContactBtn = document.getElementById('addContactBtn');
const closeModalBtn = document.getElementById('closeModal');
const addContactForm = document.getElementById('addContactForm');

// Each of the below changes the current screen based on button press
document.getElementById('settingsBtn').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'settings.html';
});
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'logout.html'; 
});

// Allows for showing and hiding the add contact window
addContactBtn.addEventListener('click', () => {
    addContactWindow.classList.remove('hidden');
});
closeModalBtn.addEventListener('click', () => {
    addContactWindow.classList.add('hidden');
});
// If the user clicks off the add user screen
addContactWindow.addEventListener('click', (e) => {
    if(e.target === addContactWindow){
        addContactWindow.classList.add('hidden');
    }
});



// Get all contacts from the php endpoint
function getContacts(){
    // Just for testing the front end logic
    let contacts = [
        {
            FirstName: 'John',
            LastName: 'Doe',
            Phone: '(239)555-5555',
            Email: 'johndoe@gmail.com',
            Address: '1234 E.S. St',
            Notes: ['a', 'b', 'c']
        },
        {
            FirstName: 'John',
            LastName: 'Doe',
            Phone: '(239)555-5555',
            Email: 'johndoe@gmail.com',
            Address: '1234 E.S. St',
            Notes: ['a', 'b', 'c']
        },
        {
            FirstName: 'John',
            LastName: 'Doe',
            Phone: '(239)555-5555',
            Email: 'johndoe@gmail.com',
            Address: '1234 E.S. St',
            Notes: ['a', 'b', 'c']
        },
        {
            FirstName: 'John',
            LastName: 'Doe',
            Phone: '(239)555-5555',
            Email: 'johndoe@gmail.com',
            Address: '1234 E.S. St',
            Notes: ['a', 'b', 'c']
        },
        {
            FirstName: 'John',
            LastName: 'Doe',
            Phone: '(239)555-5555',
            Email: 'johndoe@gmail.com',
            Address: '1234 E.S. St',
            Notes: ['a', 'b', 'c']
        },
    ]; // Need to change to actually receive real data

    contacts_data.innerHTML = '';  // Clear out the table before adding

    contacts.forEach(contact => {
        const row = document.createElement('tr');

        Object.keys(contact).forEach(key => {
            const cell = document.createElement('td');

            if (Array.isArray(contact[key])) {
                // Handle Notes field as an unordered list
                const list = document.createElement('ul');
                contact[key].forEach(note => {
                    const listItem = document.createElement('li');
                    listItem.textContent = note;
                    list.appendChild(listItem);
                });
                cell.appendChild(list);
            } else {
                // Set text content for string fields
                cell.textContent = contact[key];
            }

            row.appendChild(cell);
        });

        contacts_data.appendChild(row);
    });
}

addContactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Logic for processing new user

    addContactWindow.classList.add('hidden');
    getContacts();  // Update contacts list
});

// Makes sure it executes after loading
document.addEventListener('DOMContentLoaded', () => {
    getContacts();
});