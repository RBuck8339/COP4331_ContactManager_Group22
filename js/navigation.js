// Each of the below changes the current screen based on button press
document.getElementById('dashboardBtn').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'dashboard.html';
});
document.getElementById('contactsBtn').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'contacts.html';
});
document.getElementById('groupsBtn').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'groups.html';    
});
document.getElementById('settingsBtn').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'settings.html';
});
document.getElementById('helpBtn').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'help.html'; 
});