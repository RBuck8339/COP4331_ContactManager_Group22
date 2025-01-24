<?php
	$inData = getRequestInfo();

	$firstName = $inData["firstName"];
 	$lastName = $inData["lastName"];
 	$phone = $inData["phone"];
  	$email = $inData["email"];
	$userId = $inData["userId"];
	$userId = $inData["contactid"]; // fetch userId from database

    // Connect to database, handle error if fails
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331","contact_manager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{   
        // Delete user from database w/ their UserID
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=?");
		$stmt->bind_param("i", $contactid);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
