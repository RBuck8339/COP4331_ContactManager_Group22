const contacts_data = document.getElementById('contactsData');
const addContactWindow = document.getElementById('addContactModal');
const addContactBtn = document.getElementById('addContactBtn');
const editContactBtn = document.getElementById('editContactBtn');
const closeModalBtn = document.getElementById('closeModal');
const addContactForm = document.getElementById('addContactForm');

// Contact form elements
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const addressInput = document.getElementById('address');


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

editContactBtn.addEventListener('click', (e) => {
    
})
// Maybe have the button replace itself with a checkmark to signify being done



// INPUT VALIDITY

emailInput.addEventListener("blur", (event) => {
    const email = event.target.value; // Get the input value from the event

    // Regular Expression to validate emails
    const regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    if (regex.test(email)) {
        document.getElementById('errorMsgEmail').classList.add("hidden"); // Valid
        emailInput.classList.remove("border-red");
        emailInput.classList.add("border-green"); // Add green outline
    } else {
        document.getElementById('errorMsgEmail').classList.remove("hidden"); // Invalid
        emailInput.classList.remove("border-green");
        emailInput.classList.add("border-red"); // Add red outline
    }
});


function verifyPhone(phone){
    // Regex
    return True;
    document.getElementById('errorMsgPhone').classList.add("hidden");

    // If false, display some html saying "fix it"
    document.getElementById('errorMsgPhone').classList.remove("hidden");
}











// Limit to 50 per page
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
            //Notes: ['a', 'b', 'c']
        },
        {
            FirstName: 'John',
            LastName: 'Doe',
            Phone: '(239)555-5555',
            Email: 'johndoe@gmail.com',
            Address: '1234 E.S. St',
            //Notes: ['a', 'b', 'c']
        },
        {
            FirstName: 'John',
            LastName: 'Doe',
            Phone: '(239)555-5555',
            Email: 'johndoe@gmail.com',
            Address: '1234 E.S. St',
            //Notes: ['a', 'b', 'c']
        },
        {
            FirstName: 'John',
            LastName: 'Doe',
            Phone: '(239)555-5555',
            Email: 'johndoe@gmail.com',
            Address: '1234 E.S. St',
            //Notes: ['a', 'b', 'c']
        },
        {
            FirstName: 'John',
            LastName: 'Doe',
            Phone: '(239)555-5555',
            Email: 'johndoe@gmail.com',
            Address: '1234 E.S. St',
            //Notes: ['a', 'b', 'c']
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