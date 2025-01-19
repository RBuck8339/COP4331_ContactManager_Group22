<?php
	$inData = getRequestInfo();

	$userId = $inData["userId"]; // fetch userId from database

    // Connect to database, handle error if fails
	$conn = new mysqli("localhost", "root", "Group22Rules", "COP4331"); 
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{   
        // Delete user from database w/ their UserID
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE UserID=?");
		$stmt->bind_param("i", $userId);
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