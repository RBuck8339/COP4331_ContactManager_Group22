const contacts_data = document.getElementById('contactsData');
const addContactWindow = document.getElementById('addContactModal');
const editContactWindow = document.getElementById('editContactModal');
const addContactBtn = document.getElementById('addContactBtn');
const closeModalBtns = document.querySelectorAll('.closeModal');
const addContactForm = document.getElementById('addContactForm');
const editContactForm = document.getElementById('editContactForm');
const searchBar = document.getElementById('searchBar');

let show_edit_column = false;

function formatPhoneNumber(phone) {
    phone = phone.replace(/\D/g, ""); // Remove non-numeric characters
    if (phone.length === 10) {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"); // Format as ###-###-####
    }
    return phone; // Return unformatted if not 10 digits
}

document.addEventListener("DOMContentLoaded", function () {
    const phoneInput = document.getElementById("phone");
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

    getContacts(); // Load contacts on page load
});


// Prevents loading on local
console.log("Before readCookie(), userId:", typeof userId !== "undefined" ? userId : "Not defined");
readCookie();
console.log(`userId = ${userId}`);
console.log("After readCookie(), userId:", typeof userId !== "undefined" ? userId : "Not defined");

if (typeof userId === "undefined") {
    console.error("userId is not defined.");
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

// Update pagination button visibility
function updatePaginationButtons() {
    prevPageBtn.style.display = currentPage > 1 ? "inline-block" : "none";
    nextPageBtn.style.display = (currentPage * rowsPerPage) < contactsList.length ? "inline-block" : "none";
}

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
    const emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
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

    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');

    // Evaluate input after field is manipulated
    emailInput.addEventListener('blur', () => validateInput(emailInput, emailRegex, emailError));
    phoneInput.addEventListener('blur', () => validateInput(phoneInput, phoneRegex, phoneError));

    // Submit event listener
    addContactForm.addEventListener("submit", async (event) => {
    	// Prevent form submission if any field is invalid
		event.preventDefault();
		
		if (typeof userId === "undefined") {
			console.error("userId is not defined. Cannot submit the form.");
			return;
		}
		
        // Contact form elements
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const addressInput = document.getElementById('address');
        //const user_id = userId;


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
                phone: phoneInput.value.replace(/\D/g, ""), // Remove dashes before sending,
                email: emailInput.value.toLowerCase(), // Convert to lowercase,
                address: addressInput.value,
                userId: userId,
            };

            const response = await sendRequest({
                endpoint: 'AddContact.php',
                data: addData,
                method_type: 'POST'
            })

            await getContacts();

        } 

        // Reset the form
		addContactForm.reset();

		// Close the modal by adding the "hidden" class
		addContactWindow.classList.add("hidden");
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


// Limit to 50 per page
let currentPage = 1;
const rowsPerPage = 40;
let contactsList = []; // Stores all contacts

// Get all contacts from the php endpoint
// Fetch contacts from API and update pagination
async function getContacts(searchData = { 'search': '' }) {
    if (typeof userId === "undefined") {
        console.error("userId is not defined.");
        return;
    }

    searchData.userId = userId;
    console.log("Sending search request:", searchData);

    let response = await sendRequest({
        endpoint: 'SearchContacts.php',
        data: searchData,
        method_type: 'POST'
    });

    console.log("Response from API:", response); // Debugging

    if (response && response.results) {
        contactsList = response.results; // Correctly assign the array
    } else {
        contactsList = []; // Ensure it's an array even if empty
        console.error("Invalid data structure received:", response);
    }

    currentPage = 1; // Reset pagination
    displayContacts();
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

// Call getContacts on page load
document.addEventListener("DOMContentLoaded", function () {
    getContacts();
});


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
    document.getElementById('editFirstName').value = cells[0].innerText;
    document.getElementById('editLastName').value = cells[1].innerText;
    document.getElementById('editPhone').value = cells[2].innerText;
    document.getElementById('editEmail').value = cells[3].innerText;
    document.getElementById('editAddress').value = cells[4].innerText;
    let contact_id = cells[5].innerText;
    //let user_id = getUserId();

    editContactWindow.classList.remove('hidden');

    let delete_button = document.getElementById('deleteContactBtn');
    delete_button.onclick = async () => {
        await deleteContact(contact_id);
        getContacts();  // Reload the entire table
        editContactWindow.classList.add('hidden');  // Close modal
    }

    let submit_button = document.getElementById('editContactForm');
    submit_button.onsubmit = async (e) => {
        e.preventDefault();

        let editData = {
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            phone: document.getElementById('editPhone').value.replace(/\D/g, ""), // Remove formatting before sending,
            email: document.getElementById('editEmail').value.toLowerCase(), // Convert to lowercase,
            address: document.getElementById('editAddress').value,
            userId: userId,
            contactId: contact_id
        };
        console.log("Sending edit request with data:", editData);

        const response = await sendRequest({
            endpoint: 'EditContact.php',
            data: editData,
            method_type: 'POST'
        })
        
        console.log("Edit Contact Response (RAW):", response);
        if (!response || response.error) {
			console.error("Error updating contact:", response ? response.error : "No response received");
			alert("Error updating contact: " + (response?.error || "Unknown error"));
		} else {
			console.log("Contact updated successfully:", response);
			await getContacts();
			editContactWindow.classList.add('hidden');
		}
    };
}


// Delete contact function
async function deleteContact(row) {
    // Ensure correct cell index for contactId
    let contactIdCell = row.querySelector('.hiddenCell'); // Ensure it targets the correct cell with contactId

    if (!contactIdCell) {
        console.error("Contact ID cell not found in row.");
        alert("Error: Contact ID cell not found.");
        return;
    }

    let contactId = contactIdCell.textContent.trim();

    if (!contactId || isNaN(contactId)) {
        console.error("Invalid contactId:", contactId);
        alert("Error: Invalid contact ID.");
        return;
    }

    const deleteData = { contactId: parseInt(contactId, 10) }; // Ensure it's an integer

    console.log("Sending delete request with:", deleteData); // Debugging

    const response = await sendRequest({
        endpoint: 'DeleteContact.php',
        data: deleteData,
        method_type: 'POST'
    });

    console.log("Delete Contact Response:", response); // Debugging

    if (!response) {
        console.error("No response received from the server.");
        alert("Error deleting contact: No response from server.");
        return;
    }

    if (response.error) {
        console.error("Error deleting contact:", response.error);
        alert("Error deleting contact: " + response.error);
        return;
    }

    if (response.message) {
        console.log("Contact deleted successfully:", response.message);
        alert(response.message);
        await getContacts(); // Refresh contact list
    } else {
        console.error("Unexpected response format:", response);
        alert("Unexpected response format received.");
    }
}



// Handles API calls
async function sendRequest({ endpoint, data, method_type }) {
    try {
        console.log(`Sending request to ${urlBase}/${endpoint} with data:`, data); // Debugging

        const response = await fetch(`${urlBase}/${endpoint}`, {
            method: method_type,
            headers: { 'Content-Type': 'application/json' },
            body: method_type === 'POST' ? JSON.stringify(data) : null,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const parsedData = await response.json();
        console.log(`Response from ${endpoint}:`, parsedData); // Debugging

        if (!parsedData) {
            console.error("Empty response received from server.");
            return { error: "Empty response from server" };
        }

        // Handle different response structures
        if (parsedData.message) {
            return parsedData; // Accept success responses
        } 
        else if (parsedData.results) {
            return parsedData; // Accept search results
        } 
        else if (parsedData.error) {
            console.error("Error received from API:", parsedData.error);
            return { error: parsedData.error };
        } 
        else {
            return { error: "No valid data returned" };
        }
    } 
    catch (error) {
        console.error("Fetch Error:", error);
        return { error: error.message };
    }
}