<?php
	$inData = getRequestInfo();

	$contactid = $inData["contactid"]; // fetch userId from database

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

		// Confirm deletion attempt
		if ($stmt->affected_rows > 0) {
			// Deletion was successful
			returnWithMessage("Contact deleted successfully.");
		} else {
			// No rows were affected (no contact found with that ID)
			returnWithError("No contact found with ID: " . $contactId);
		}

		$stmt->close();
		$conn->close(); 
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithMessage($msg)
	{
		$retValue = '{"message":"' . $msg . '","error":""}';
		sendResultInfoAsJson($retValue);
	}
?>