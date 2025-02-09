const contacts_data = document.getElementById('contactsData');
const addContactWindow = document.getElementById('addContactModal');
const editContactWindow = document.getElementById('editContactModal');
const addContactBtn = document.getElementById('addContactBtn');
const closeModalBtns = document.querySelectorAll('.closeModal');
const addContactForm = document.getElementById('addContactForm');
const editContactForm = document.getElementById('editContactForm');
const searchBar = document.getElementById('searchBar');

// Table handling functions
let currentPage = 1;
const rowsPerPage = 30;
let contactsList = []; // Stores all contacts

let show_edit_column = false


// Formats the phone number inside the input field
function formatPhoneNumber(phone) {
    phone = phone.replace(/\D/g, ""); // Remove non-numeric characters
    if (phone.length === 10) {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"); // Format as ###-###-####
    }
    return phone; // Return unformatted if not 10 digits
}

// Prevents loading on local
document.addEventListener("DOMContentLoaded", function () {
    // TODO MIGHT NEED THIS BACK

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
        userId = data.userId;
        
        // Ensure this code executes AFTER the session check and authentication
        getContacts();
    })


    if(userId == -1){
        console.error("Not logged in. Redirecting...");
        window.location.href = "login"; 
    };
    
    getContacts(); // Load contacts on page load
});


// This will change the theme based on user input
const toggleThemeBtn = document.getElementById('themeBtn');
const docBody = document.body;

function updateThemeText(){
    if(docBody.classList.contains("darkMode")){
        toggleThemeBtn.textContent = 'Light Mode';
    }
    else{
        toggleThemeBtn.textContent = 'Dark Mode';
    }
}

if (localStorage.getItem("darkMode") === "enabled") {
    docBody.classList.add("darkMode");
}

toggleThemeBtn.addEventListener('click', (e) => {
    docBody.classList.toggle("darkMode");

    // Save preference for page reload
    if (docBody.classList.contains("darkMode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
    updateThemeText();
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
    function validateInput(input, regex, errorMsg, type) {
        // Validates phone number length
        if (type === "phone") {
            let value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
    
            if (value.length !== 10) {
                errorMsg.classList.remove("hidden"); // Show error if not 10 digits
                input.classList.add("border-red");
                return;
            }
    
            // Format the number before validation
            input.value = value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        }

        if (regex.test(input.value)) {
            errorMsg.classList.add('hidden'); // Hide error message if valid
            input.classList.remove('border-red'); // Remove error outline
        } 
        else {
            errorMsg.classList.remove('hidden'); // Show error message if invalid
            input.classList.add('border-red'); // Add error outline
        }
    }

    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const editPhoneInput = document.getElementById("editPhone");

    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            this.value = formatPhoneNumber(this.value);
        });
    }

    if (editPhoneInput) {
        editPhoneInput.addEventListener("input", function () {
            this.value = formatPhoneNumber(this.value);
        });
    }

    // Evaluate input after field is manipulated
    emailInput.addEventListener('input', () => validateInput(emailInput, emailRegex, emailError, "email"));
    phoneInput.addEventListener('input', () => validateInput(phoneInput, phoneRegex, phoneError, "phone"));

    // Submit event listener
    addContactForm.addEventListener("submit", async (event) => {
        // Contact form elements
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
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
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                phone: phoneInput.value.replace(/\D/g, ""),
                email: emailInput.value.toLowerCase(),
                address: addressInput.value,
                userId: userId,
            };

            const response = await sendRequest({
                endpoint: 'AddContact.php',
                data: addData,
                method_type: 'POST'
            })

            await getContacts();

            // Reset the form
            addContactForm.reset();

            // Close the modal by adding the "hidden" class
            addContactWindow.classList.add("hidden");
        } 
        else {
            // Prevent form submission if any field is invalid
            event.preventDefault();
        }
    });

    document.getElementById('editContactBtn').addEventListener('click', () => {
        let editColumn = document.getElementById('editColumnHeader');
        let tableHeader = document.getElementById('contactsHeader'); // Select the existing row inside the thead

        if(editColumn){
            editColumn.remove();
            // Remove associated rows in this column
            for(let row of contacts_data.children){
                row.deleteCell(-1);
            }
            show_edit_column = false;  // Make sure the column is hidden
        }
        else{
            let header = document.createElement("th");
            header.textContent = 'Edit Contact';
            header.id = 'editColumnHeader';
            tableHeader.appendChild(header);

            for(let row of contacts_data.children){
                createEditCells(row);
            }
            show_edit_column = true;  // Make sure the column shows next time we load contacts
        }
    })

    // Search Contacts
    searchBar.addEventListener('input', async () => {
        let curr_search = searchBar.value;
        //let user_id = userId; 
        let searchData;

        let name_parts = curr_search.split(' ');
        let first_name;
        let last_name;

        if(name_parts.length === 1){
            first_name = name_parts[0];

            searchData = {
                'search': first_name,
                userId: userId
            }
        }
        // Just using first two
        else{
            first_name = name_parts[0];
            last_name = name_parts[1];

            searchData = {
                'search': first_name,
                'search2': last_name,
                userId: userId
            }
        }

        getContacts(searchData);
    })
});

prevPageBtn = document.getElementById("prevPageBtn");
nextPageBtn = document.getElementById("nextPageBtn");

// Update pagination button visibility
function updatePaginationButtons() {
    prevPageBtn.style.display = currentPage > 1 ? "inline-block" : "none";
    nextPageBtn.style.display = (currentPage * rowsPerPage) < contactsList.length ? "inline-block" : "none";
}

// Function to display contacts based on pagination
function displayContacts() {
    contacts_data.innerHTML = ''; // Clear the table

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedContacts = contactsList.slice(start, end);

    paginatedContacts.forEach(contact => {
        const row = document.createElement('tr');

        Object.keys(contact).forEach(key => {
            const cell = document.createElement('td');

            if (key === "contactId") {
                cell.textContent = contact[key];
                cell.classList.add('hiddenCell');  
            } else if (key === "phone") {  
                cell.textContent = formatPhoneNumber(contact[key]);  // Format phone numbers
            }else {
                cell.textContent = contact[key]; 
            }

            row.appendChild(cell);
        });

        if (show_edit_column) {
            createEditCells(row);
        }

        contacts_data.appendChild(row);
    });

    updatePaginationButtons();
}

// Event Listeners for Pagination
nextPageBtn.addEventListener('click', () => {
    if ((currentPage * rowsPerPage) < contactsList.length) {
        currentPage++;
        displayContacts();
    }
});

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayContacts();
    }
});


// Limit to 50 per page
// Get all contacts from the php endpoint
async function getContacts(searchData = {'search': ''}){  // Probably need to have this detect null input
    if (typeof userId === "undefined") {
        console.error("userId is not defined.");
        return;
    }

    searchData.userId = userId; // Set id to search with
    let contacts = await sendRequest({
        endpoint: 'SearchContacts.php',
        data: searchData,
        method_type: 'POST'
    });  // Contacts to add to the table

    if(!contacts) contacts = [];  // No contacts to display


    contacts_data.innerHTML = '';  // Clear out the table before adding

    contacts.forEach(contact => {
        const row = document.createElement('tr');

        Object.keys(contact).forEach(key => {
            const cell = document.createElement('td');

            if(key === "contactId") {
                // Set text content for string fields
                cell.textContent = contact[key];
                cell.classList.add('hiddenCell');  // If we are hiding the column (false by default)
            }
            // We keep the id cell hidden but available for reference
            else{
                cell.textContent = contact[key]; 
            }

            row.appendChild(cell);
        });

        // Since we need to create the column
        if (show_edit_column) {
            createEditCells(row);
        }

        contacts_data.appendChild(row);
    });

    currentPage = 1; // Reset pagination
}


function createEditCells(row){
    let cell = document.createElement('td');
    let div = document.createElement('div');
    
    div.id = 'editButtons';

    let edit_button_img = document.createElement('img');
    edit_button_img.src = 'assets/images/edit.png';
    edit_button_img.alt = 'Edit Contact';
    edit_button_img.onclick = () => {
        editContact(row);
    };

    let delete_button_img = document.createElement('img');
    delete_button_img.src = 'assets/images/trash.png';
    delete_button_img.alt = 'Delete Contact';
    delete_button_img.onclick = () => {
        deleteContact(row);
    };

    div.appendChild(edit_button_img);
    div.appendChild(delete_button_img);
    cell.appendChild(div);
    row.appendChild(cell);
}



// Make the pop up for editing a contact and add the information immediately
function editContact(row){
    let cells = row.getElementsByTagName('td');

    // Fill in current data
    document.getElementById('editFirstName').value = cells[1].innerText;
    document.getElementById('editLastName').value = cells[2].innerText;
    document.getElementById('editPhone').value = cells[3].innerText;
    document.getElementById('editEmail').value = cells[4].innerText;
    document.getElementById('editAddress').value = cells[5].innerText;
    let contact_id = cells[0].innerText;

    editContactWindow.classList.remove('hidden');

    let delete_button = document.getElementById('deleteContactBtn');
    delete_button.onclick = async () => {
        await deleteContact(row);
        getContacts();  // Reload the entire table
        editContactWindow.classList.add('hidden');  // Close modal
    }

    let submit_button = document.getElementById('editContactForm');
    submit_button.onsubmit = async (e) => {
        e.preventDefault();

        let editData = {
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            email: document.getElementById('editEmail').value.toLowerCase(),
            phone: document.getElementById('editPhone').value.replace(/\D/g, ""),
            address: document.getElementById('editAddress').value,
            userId: userId,
            contactId: contact_id
        };

        const response = await sendRequest({
            endpoint: 'EditContact.php',
            data: editData,
            method_type: 'POST'
        })

        await getContacts();  // Reload the entire table
        editContactWindow.classList.add('hidden');
    }
}


async function deleteContact(row){
    // User data
    let contactId;

    let contactIdCell = row.querySelector('.hiddenCell');
    if (contactIdCell) {
        contactId = contactIdCell.textContent.trim();
    }

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



// Handles API calls
async function sendRequest({ endpoint, data, method_type}) {
    try {
        const response = await fetch(`${urlBase}/${endpoint}`, {
            method: method_type,  
            headers: { 'Content-Type': 'application/json' },
            body: method_type === 'POST' ? JSON.stringify(data) : null,  // Only include body for POST
        });

        // Ensure response is okay before proceeding
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const parsedData = await response.json();  // Parse JSON directly

        // We don't care if the error is no records found
        if (parsedData.error && parsedData.error !== 'No Records Found') {
            console.error('Error receiving data from endpoint. Please try again later');
            return null;
        } 
        else {
            let return_data = parsedData.results;
            return return_data;  // Update the contacts if we did not encounter an error
        }
    } 
    catch (error) {
        console.error("Fetch Error:", error);
        alert("An error occurred. Please try again later.");
        return null;
    }
}