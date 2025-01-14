const loginBox = document.getElementById('loginMenu');
const registerBox = document.getElementById('registerMenu');

// Function to toggle between login and register forms
const toggleScreen = (showScreenLogin) => {
    // Could add some more reactivity when switching between screens (such as elements fading upwards)
    if(showScreenLogin) {
        loginBox.classList.remove('hidden');
        registerBox.classList.add('hidden');
        document.getElementById('toLoginBtn').classList.add('activePage'); // Correct button ID
        document.getElementById('toRegisterBtn').classList.remove('activePage');
    }
    else {
        loginBox.classList.add('hidden');
        registerBox.classList.remove('hidden');
        document.getElementById('toRegisterBtnReg').classList.add('activePage'); // Correct button ID
        document.getElementById('toLoginBtnReg').classList.remove('activePage');
    }
}

// Event listener for moving to the login screen
document.getElementById('toLoginBtnReg').addEventListener('click', (e) => {
    e.preventDefault();
    toggleScreen(true);
});

// Event listener for moving to the register screen
document.getElementById('toRegisterBtn').addEventListener('click', (e) => {
    e.preventDefault();
    toggleScreen(false);
});
toggleScreen(true);  // Upon page entry so login displays first