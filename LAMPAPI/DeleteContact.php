<?php
	$inData = getRequestInfo();

	if (!isset($inData["contactId"]) || empty($inData["contactId"])) {
		returnWithError("Invalid contact ID.");
		exit();
	}

	$contactId = $inData["contactId"]; // Fetch contactId from request

	// Handle case where contactId is an array instead of a single value
	if (is_array($contactId)) {
		error_log("contactId is an array, using first value: " . json_encode($contactId));
		$contactId = reset($contactId); // Use first element in array
	}

	// Ensure it's an integer for database safety
	$contactId = intval($contactId); 

    // Connect to database, handle error if fails
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_manager");

	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
		exit();
	} 

	// Delete user from database w/ their contact ID
	$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=?");

	if ($stmt === false) {
		returnWithError("SQL statement preparation failed: " . $conn->error);
		exit();
	}

	$stmt->bind_param("i", $contactId);
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
	$retValue = json_encode(["error" => $err]);
	sendResultInfoAsJson($retValue);
	exit();
}

function returnWithMessage($msg)
{
    $retValue = '{"success":true, "message":"' . $msg . '", "error":""}';
    sendResultInfoAsJson($retValue);
}
?>
