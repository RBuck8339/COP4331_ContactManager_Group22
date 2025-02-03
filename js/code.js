// Redirect non-www to www version
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.hostname === "contactsbycoastal.com") {
        window.location.href = "http://www.contactsbycoastal.com" + window.location.pathname + window.location.search;
    }
});

const urlBase = 'http://www.contactsbycoastal.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

const passwordError = document.getElementById('errorMsgPassword');
const passwordConfirmErorr = document.getElementById('errorMsgPasswordConfirm');
const password = document.getElementById('registerPassword');
const passwordConfirm = document.getElementById('registerPasswordConfirm');

// Register user upon clicking register
const registerForm =  document.getElementById('registerForm');
registerForm.addEventListener("submit", (event) => {
	checkRegister(event);
});

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener("submit", (event) => {
	loginUser(event)
	event.preventDefault();
});

function loginUser(){	

	// Fetch login information
	const login = document.getElementById('loginUsername').value;
	const password = document.getElementById('loginPassword').value;

	// Create json for login data
	const data = { 
		login: login,
		password: password
	};

	// Send POST request to the login endpoint
	fetch(`${urlBase}/Login.php`, {
		method: 'POST', 
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	.then(response => response.text())  // Get the response as text first
	.then(text => {
	  console.log("Server Response:", text);  // Log the response text
	  try {
		const data = JSON.parse(text);  // Try parsing the response as JSON
		if (data.error) {
		  alert(`Login failed: ${data.error}`);
		} else {
		  // If login is successful, save cookies
		  firstName = data.firstName;
		  lastName = data.lastName;
		  userId = data.userId;  // Assuming userId is returned by the server

		  // Save session to cookies
		  saveCookie(firstName, lastName, userId);

		  // Notify user of login and redirect to contacts page
		  window.location.href = 'contacts'; 
		}
	  } catch (err) {
		console.error("Error parsing response:", err);
		alert("Failed to parse server response.");
	  }
	})
	// Detect any fetch or CORS errors
	.catch(error => {
	  console.error("Error in fetch:", error);
	  alert("An error occurred. Please try again later.");
	});
}

function saveCookie(firstName, lastName, userId)
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = `firstName=${firstName}; lastName=${lastName}; userId=${userId}; expires=${date.toUTCString()}; path=/`;	
	console.log("Cookie saved");
	console.log(document.cookie);
}

function readCookie()
{
	userId = -1; // Default userId

	// Get cookie string and split into key-value pairs 
	let data = document.cookie;
	let splits = data.split(";");
	for(var i = 0; i < splits.length; i++) 
	{
		// Remove trialing white spices and split key-value pairs
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");

		// Set fields accordingly 
		if(tokens[0] == "firstName")
		{
			firstName = tokens[1];
		}
		else if(tokens[0] == "lastName")
		{
			lastName = tokens[1];
		}
		else if(tokens[0] == "userId")
		{
			userId = parseInt(tokens[1].trim());
		}
	}
	
	//If userId is not valid, redirect to login
	if(userId < 0)
	{
		window.location.href = "index";
	}
	// Update UI to confirm login status
	else
	{
		console.log("Cookie has been read");
		console.log("Logged in as " + firstName + " " + lastName);
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}

// Checks if password follows format
function validatePassword(input, regex, errorMsg) {
	// If password invalid
    if (regex.test(input.value)) {
        errorMsg.classList.add('hidden'); // Hide error message if valid
        input.classList.remove('border-red'); // Remove error outline
    } else {
        errorMsg.classList.remove('hidden'); // Show error message if invalid
        input.classList.add('border-red'); // Add error outline
    }
}

// Checks if the user confirms their password
function confirmPassword(input, password1, password2, errorMsg){
	// If passwords do not match
	if(password1 === password2){
		errorMsg.classList.add('hidden'); // Hide error message if valid
		input.classList.remove('border-red'); // Remove error outline
	} else {
		errorMsg.classList.remove('hidden'); // Show error message if invalid
		input.classList.add('border-red'); // Add error outline
	}
}

// Regex to validate password
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Za-z])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

password.addEventListener('blur', () => validatePassword(password, passwordRegex, passwordError));
passwordConfirm.addEventListener('blur', () => confirmPassword(passwordConfirm, password.value, passwordConfirm.value, passwordConfirmErorr));

// Check if we can register the user 
function checkRegister(event){
	
	//Fetch input forms and user's information
	const firstName = document.getElementById('userFirstName').value;
	const lastName = document.getElementById('userLastName').value;
	const login = document.getElementById('registerUsername').value;

	// Perform password checks
	validatePassword(password, passwordRegex, passwordError);
	confirmPassword(passwordConfirm, password.value, passwordConfirm.value, passwordConfirmErorr);

	const isPasswordValid = passwordError.classList.contains('hidden');
    const isPasswordMatch = passwordConfirmErorr.classList.contains('hidden');

	// If password is valid and confirmed
	if (isPasswordValid && isPasswordMatch) {
        // All fields are valid, proceed with form submission or API call
        console.log("Form is valid");
		registerUser(firstName, lastName, login, password.value, event);

		event.preventDefault(); // REMEMBER TO REMOVE THIS AFTER TESTING
		//STOP event if an error occurs, can use a return val
		// Could add redirect to login or call login endpoint after API call

    } else {
        // Prevent form submission if any field is invalid
        event.preventDefault();
    }
}

// Register user into database 
async function registerUser(firstName, lastName, login, password, event){
	// Gather user data from input fields 
	const data = { 
		firstName,
		lastName,
		login,
		password
	};	

	try{
		// Create POST request to register user 
		const response = await fetch(`${urlBase}/Register.php`, {
			method: "POST",
			headers: { "Content-Type": "application/json"},
			body: JSON.stringify(data),
		});

		// Handle network error 
		if(!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		// Parse JSON response 
		const result = await response.json(); 

		// Handle success and error
		if(result.error === "") {
			alert("Registration succesful!"); // Enters user into database 
			window.location.href = 'index'; // Redirect to Login Page
		} else if(result.error === "User already exists."){
			alert(`${result.error} Please enter a different username.`);
		} else{
			alert("An unexpected error occurred. Please try again later.");
		}
	} catch (error) {
		// Catch any other unexpected errors
		alert("An unexpected error occurred. Please try again later.");
	}
}