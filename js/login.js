const loginBox = document.querySelector('.loginBox');
const loginMenu = document.getElementById('loginMenu');
const registerMenu = document.getElementById('registerMenu');

// Function to toggle between login and register forms
const toggleScreen = (showScreenLogin) => {
    // Could add some more reactivity when switching between screens (such as elements fading upwards)
    if(showScreenLogin) {
        loginMenu.classList.remove('hidden');
        registerMenu.classList.add('hidden');
        document.getElementById('toLoginBtn').classList.add('activePage'); // Correct button ID
        document.getElementById('toRegisterBtn').classList.remove('activePage');
        loginBox.style.height = '57%';
        loginBox.style.width = '31%';
    }
    else {
        loginMenu.classList.add('hidden');
        registerMenu.classList.remove('hidden');
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