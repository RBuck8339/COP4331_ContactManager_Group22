
<?php
session_start(); // Start the session

$inData = getRequestInfo();

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_manager");
if( $conn->connect_error )
{
	returnWithError( $conn->connect_error );
}
else
{
	$stmt = $conn->prepare("SELECT ID,FirstName,LastName FROM Users WHERE Login=? AND Password =?");
	$stmt->bind_param("ss", $inData["login"], $inData["password"]);
	$stmt->execute();
	$result = $stmt->get_result();
	
	if( $row = $result->fetch_assoc()  )
	{
		// Store user session variables
        $_SESSION['userId'] = $row['ID'];
        $_SESSION['firstName'] = $row['FirstName'];
        $_SESSION['lastName'] = $row['LastName'];
        
		returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] );
	}
	else
	{
		returnWithError("No Records Found");
	}
	
	$stmt->close();
	$conn->close();
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
	header('Content-type: application/json');
	echo $obj;
}

function returnWithError( $err )
{
	$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
	sendResultInfoAsJson( $retValue );
}

$id = 0;
$firstName = "";
$lastName = "";

function returnWithInfo( $firstName, $lastName, $id )
{
	$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
	sendResultInfoAsJson( $retValue );
}
	
?>
