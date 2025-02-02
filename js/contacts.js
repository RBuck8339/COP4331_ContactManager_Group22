const contacts_data = document.getElementById('contactsData');
const addContactWindow = document.getElementById('addContactModal');
const editContactWindow = document.getElementById('editContactModal');
const addContactBtn = document.getElementById('addContactBtn');
const closeModalBtns = document.querySelectorAll('.closeModal');
const addContactForm = document.getElementById('addContactForm');
const editContactForm = document.getElementById('editContactForm');
const searchBar = document.getElementById('searchBar');



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
addContactForm.addEventListener("submit", async (event) => {
    // Contact form elements
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const addressInput = document.getElementById('address');


    // Validate inputs in case the user clicks submit without making changes
    validateInput(emailInput, emailRegex, emailError);
    validateInput(phoneInput, phoneRegex, phoneError);

    // Check if all error messages are hidden
    const isEmailValid = emailError.classList.contains('hidden');
    const isPhoneValid = phoneError.classList.contains('hidden');

    if (isEmailValid && isPhoneValid) {
        // All fields are valid, proceed with form submission or API call
        event.preventDefault();

        let addData = {
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            phone: document.getElementById('editPhone').value,
            email: document.getElementById('editEmail').value,
            address: document.getElementById('editAddress').value,
            userId: user_id,
        };

        const response = await sendRequest({
            endpoint: 'AddContact.php',
            data: addData,
            method_type: 'POST'
        })

        await getContacts();


    } else {
        // Prevent form submission if any field is invalid
        event.preventDefault();
    }
});


// Limit to 50 per page
// Get all contacts from the php endpoint
async function getContacts(searchData = {'search': ''}){  // Probably need to have this detect null input
    searchData.userId = getUserId();

    const response = await sendRequest({
        endpoint: 'searchContacts.php',
        data: searchData,
        method_type: 'POST'
    });  // Contacts to add to the table

    // MOVE POST REQUESTS HERE


    contacts_data.innerHTML = '';  // Clear out the table before adding

    contacts.forEach(contact => {
        const row = document.createElement('tr');

        Object.keys(contact).forEach(key => {
            const cell = document.createElement('td');

            if(key === "contactId") {
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
    let user_id = getUserId();

    editContactWindow.classList.remove('hidden');

    let delete_button = document.getElementById('deleteContactBtn');
    delete_button.onclick = async () => {
        await deleteContact(row);
        getContacts();  // Reload the entire table
    }

    let submit_button = document.getElementById('editContactForm');
    submit_button.onsubmit = async (e) => {
        e.preventDefault();

        let editData = {
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            address: document.getElementById('editAddress').value,
            userId: user_id,
            contactId: contact_id
        };

        const response = await sendRequest({
            endpoint: 'DeleteContact.php',
            data: editData,
            method_type: 'POST'
        })

        await getContacts();  // Reload the entire table
    }
}


async function deleteContact(row){
    // User data
    let cells = row.getElementsByTagName('td');
    let contactId = cells[5].innerText;
    //let userId = getUserId();

    // TODO API TEAM
    // Add API call to delete the contact
    const deleteData = {
        'contactId' : contactId
    }

    const response = await sendRequest({
        endpoint: 'DeleteContact.php',
        data: deleteData,
        method_type: 'POST'
    })

    await getContacts();  // Update the table
}


// Search Contacts
searchBar.addEventListener('input', async () => {
    let curr_search = searchBar.value;
    let user_id = getUserId(); 
    let searchData;

    let name_parts = curr_search.split(' ');
    let first_name;
    let last_name;

    if(name_parts.length === 1){
        first_name = name_parts[0];

        searchData = {
            'search': first_name,
            userId: user_id
        }
    }
    // Just using first two
    else{
        first_name = name_parts[0];
        last_name = name_parts[1];

        searchData = {
            'search': first_name,
            'search2': last_name,
            userId: user_id
        }
    }

    getContacts(searchData);
})

// Handles API calls
async function sendRequest({ endpoint, data, method_type}) {
    try {
        const response = await fetch(endpoint, {
            method: method_type,  
            headers: { 'Content-Type': 'application/json' },
            body: method_type === 'POST' ? JSON.stringify(data) : null,  // Only include body for POST
        });

        // Ensure response is okay before proceeding
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const parsedData = await response.json();  // Parse JSON directly
        console.log("Server Response:", parsedData);

        if (parsedData.error) {
            alert('Error receiving data from endpoint. Please try again later');
            return null;
        } 
        else {
            return parsedData;  // Update the contacts if we did not encounter an error
        }
    } 
    catch (error) {
        console.error("Fetch Error:", error);
        alert("An error occurred. Please try again later.");
        return null;
    }
}


// Cookies Utils:
function getUserId() {
    let data = document.cookie;
    let splits = data.split(","); // Split by commas
    for (let i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("="); // Split key=value
        if (tokens[0] === "userId") {
            return parseInt(tokens[1].trim()); // Convert to number
        }
    }
    return null; // Return null if not found
}


// Makes sure it executes after loading
document.addEventListener('DOMContentLoaded', () => {
    getContacts();
});
