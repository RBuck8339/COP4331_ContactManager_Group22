
const urlBase = 'http://contactsbycoastal.com/LAMPAPI';
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
	doRegister(event);
});

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
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

// Register user into database
function doRegister(event){
	
	//Fetch input forms and user's information
	firstName = document.getElementById('userFirstName').value;
	lastName = document.getElementById('userLastName').value;
	const username = document.getElementById('registerUsername');

	// Perform password checks
	validatePassword(password, passwordRegex, passwordError);
	confirmPassword(passwordConfirm, password.value, passwordConfirm.value, passwordConfirmErorr);

	const isPasswordValid = passwordError.classList.contains('hidden');
    const isPasswordMatch = passwordConfirmErorr.classList.contains('hidden');

	// If password is valid and confirmed
	if (isPasswordValid && isPasswordMatch) {
        // All fields are valid, proceed with form submission or API call
        console.log("Form is valid");
        
		const data = {
			firstName,
			lastName,
			username,
			password
		};
		
    } else {
        // Prevent form submission if any field is invalid
        event.preventDefault();
    }
}