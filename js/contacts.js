const contacts_data = document.getElementById('contactsData');
const addContactWindow = document.getElementById('addContactModal');
const editContactWindow = document.getElementById('editContactModal');
const addContactBtn = document.getElementById('addContactBtn');
const closeModalBtns = document.querySelectorAll('.closeModal');
const addContactForm = document.getElementById('addContactForm');
const editContactForm = document.getElementById('editContactForm');
const searchBar = document.getElementById('searchBar');

// Contact form elements
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const addressInput = document.getElementById('address');

// Prevents loading on local
document.addEventListener("DOMContentLoaded", function () {
    fetch("LAMPAPI/checkSession.php", { 
        method: "GET",
        credentials: "same-origin" // Ensures cookies/session are sent
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Session check failed");
        }
        return response.json();
    })
    .then(data => {
        console.log("User authenticated:", data);
    })
    .catch(error => {
        console.error("Not logged in. Redirecting...");
        window.location.href = "login"; 
    });

    // Ensure this code executes AFTER the session check
    initializeContactsPage();
});

// Each of the below changes the current screen based on button press
document.getElementById('settingsBtn').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'settings';
});
document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            fetch("LAMPAPI/Logout.php", { // Adjusted path
                method: "GET",
                credentials: "same-origin" // Ensures cookies/session data are sent
            })
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url; // Redirect to login.html
                } else {
                    console.log("Logout successful, redirecting...");
                    window.location.href = "login"; // Ensure manual redirection
                }
            })
            .catch(error => console.error("Logout Error:", error));
        });
    } else {
        console.error("Logout button not found.");
    }
});


// Allows for showing and hiding the modals
addContactBtn.addEventListener('click', () => {
    addContactWindow.classList.remove('hidden');
});

// For closing the modals
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        addContactWindow.classList.add('hidden');
        editContactWindow.classList.add('hidden');
    });
});
// If the user clicks off the modal
addContactWindow.addEventListener('mousedown', (e) => {
    if(e.target === addContactWindow){
        addContactWindow.classList.add('hidden');
    }
});
editContactWindow.addEventListener('mousedown', (e) => {
    if(e.target === editContactWindow){
        editContactWindow.classList.add('hidden');
    }
})


// INPUT VALIDITY

// Error prompts
const emailError = document.getElementById('errorMsgEmail');
const phoneError = document.getElementById('errorMsgPhone');

// Email and phone regex
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const phoneRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

// Input validation function
function validateInput(input, regex, errorMsg) {
    if (regex.test(input.value)) {
        errorMsg.classList.add('hidden'); // Hide error message if valid
        input.classList.remove('border-red'); // Remove error outline
    } else {
        errorMsg.classList.remove('hidden'); // Show error message if invalid
        input.classList.add('border-red'); // Add error outline
    }
}

// Evaluate input after field is manipulated
emailInput.addEventListener('blur', () => validateInput(emailInput, emailRegex, emailError));
phoneInput.addEventListener('blur', () => validateInput(phoneInput, phoneRegex, phoneError));

// Submit event listener
addContactForm.addEventListener("submit", (event) => {
    // Validate inputs in case the user clicks submit without making changes
    validateInput(emailInput, emailRegex, emailError);
    validateInput(phoneInput, phoneRegex, phoneError);

    // Check if all error messages are hidden
    const isEmailValid = emailError.classList.contains('hidden');
    const isPhoneValid = phoneError.classList.contains('hidden');

    if (isEmailValid && isPhoneValid) {
        // All fields are valid, proceed with form submission or API call
        console.log("Form is valid");
        // Add API call logic here
    } else {
        // Prevent form submission if any field is invalid
        event.preventDefault();
    }
});


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
            id: 3
            //Notes: ['a', 'b', 'c']
        },
        {
            FirstName: 'John',
            LastName: 'Doe',
            Phone: '(239)555-5555',
            Email: 'johndoe@gmail.com',
            Address: '1234 E.S. St',
            id: 4
            //Notes: ['a', 'b', 'c']
        },
        {
            FirstName: 'John',
            LastName: 'Doe',
            Phone: '(239)555-5555',
            Email: 'johndoe@gmail.com',
            Address: '1234 E.S. St',
            id: 5
            //Notes: ['a', 'b', 'c']
        },
        {
            FirstName: 'John',
            LastName: 'Doe',
            Phone: '(239)555-5555',
            Email: 'johndoe@gmail.com',
            Address: '1234 E.S. St',
            id: 6
            //Notes: ['a', 'b', 'c']
        },
        {
            FirstName: 'John',
            LastName: 'Doe',
            Phone: '(239)555-5555',
            Email: 'johndoe@gmail.com',
            Address: '1234 E.S. St',
            id: 7
            //Notes: ['a', 'b', 'c']
        },
    ]; // Need to change to actually receive real data
    // TODO API TEAM


    contacts_data.innerHTML = '';  // Clear out the table before adding

    contacts.forEach(contact => {
        const row = document.createElement('tr');

        Object.keys(contact).forEach(key => {
            const cell = document.createElement('td');

            if(key === "id") {
                // Set text content for string fields
                cell.textContent = contact[key];
                cell.classList.add('hiddenCell');
            }
            // We keep the id cell hidden but available for reference
            else{
                cell.textContent = contact[key]; 
            }

            row.appendChild(cell);
        });

        contacts_data.appendChild(row);
    });
}


document.getElementById('editContactBtn').addEventListener('click', () => {
    let editColumn = document.getElementById('editColumnHeader');
    let tableHeader = document.getElementById('contactsHeader'); // Select the existing row inside the thead

    if(editColumn){
        editColumn.remove();
        // Remove associated rows in this column
        for(let row of contacts_data.children){
            row.deleteCell(-1);
        }
    }
    else{
        let header = document.createElement("th");
        header.textContent = 'Edit Contact';
        header.id = 'editColumnHeader';
        tableHeader.appendChild(header);

        for(let row of contacts_data.children){
            let cell = document.createElement('td');
            let div = document.createElement('div');
            
            div.id = 'editButtons';

            // Edit button as an image
            let edit_button_img = document.createElement('img');
            edit_button_img.src = 'assets/images/edit.png';
            edit_button_img.alt = 'Edit Contact';
            edit_button_img.onclick = () => {
                editContact(row);
            }

            // Delete button as an image
            let delete_button_img = document.createElement('img');
            delete_button_img.src = 'assets/images/trash.png';
            delete_button_img.alt = 'Delete Contact';
            delete_button_img.onclick = () => {
                deleteContact(row);
            }

            // Append images directly
            div.appendChild(edit_button_img);
            div.appendChild(delete_button_img);
            cell.appendChild(div);
            row.appendChild(cell);

        }
    }
})


// Make the pop up for editing a contact and add the information immediately
function editContact(row){
    let cells = row.getElementsByTagName('td');

    // Fill in current data
    document.getElementById('editFirstName').value = cells[0].innerText;
    document.getElementById('editLastName').value = cells[1].innerText;
    document.getElementById('editEmail').value = cells[2].innerText;
    document.getElementById('editPhone').value = cells[3].innerText;
    document.getElementById('editAddress').value = cells[4].innerText;
    let contact_id = cells[5].innerText;

    editContactWindow.classList.remove('hidden');

    let delete_button = document.getElementById('deleteContactBtn');
    delete_button.onclick = () => {
        deleteContact(row);
    }

    let submit_button = document.getElementById('editContactForm');
    submit_button.onsubmit = (e) => {
        e.preventDefault();

        let contactData = {
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            emailAddress: document.getElementById('editEmail').value,
            phoneNumber: document.getElementById('editPhone').value,
            address: document.getElementById('editAddress').value,
            // Can add contact_id here 
        };

        // TODO API TEAM
        // Add submit logic to update the users information

    }
}


function deleteContact(row){

}

function addContact(data){

}

// Search Contacts
searchBar.addEventListener('input', () => {
    let curr_search = searchBar.value;

    let name_parts = curr_search.split(' ');
    let first_name;
    let last_name;

    if(name_parts.length === 1){
        first_name = name_parts[0];
        last_name = name_parts[0];
    }
    // Just using first two
    else{
        first_name = name_parts[0];
        last_name = name_parts[1];
    }

    console.log('First name is %s\n', first_name);
    console.log('Last name is %s\n', last_name);

    // Add logic for search call

})


// Makes sure it executes after loading
document.addEventListener('DOMContentLoaded', () => {
    getContacts();
});