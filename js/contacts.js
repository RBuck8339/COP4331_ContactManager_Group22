const contacts_data = document.getElementById('contactsData');


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

// Makes sure it executes after loading
document.addEventListener('DOMContentLoaded', () => {
    getContacts();
});