<?php
$inData = getRequestInfo();

if (empty($inData)) {
    returnWithError("No data received in request.");
    exit();
}

error_log("Received data: " . json_encode($inData)); // Debugging

$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phone = $inData["phone"];
$email = $inData["email"];
$address = $inData["address"];
$contactId = $inData["contactId"];
$userId = $inData["userId"];

// Connect to database
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_manager");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}

// **FIX: Define SQL Query**
$sql = "UPDATE Contacts 
        SET FirstName=?, LastName=?, Phone=?, Email=?, Address=?
        WHERE ID=? AND UserID=?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    returnWithError("SQL statement preparation failed: " . $conn->error);
    exit();
}

$stmt->bind_param("ssssssi", $firstName, $lastName, $phone, $email, $address, $contactId, $userId);

if (!$stmt->execute()) {
    returnWithError("SQL execution failed: " . $stmt->error);
    exit();
}

returnWithSuccess();

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
    error_log("API Response: " . $obj); // Debugging
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithSuccess()
{
    $retValue = '{"success": true, "message": "Contact updated successfully."}';
    sendResultInfoAsJson($retValue);
}
?>
