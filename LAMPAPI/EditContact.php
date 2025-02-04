<?php
$inData = getRequestInfo();

$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phone = $inData["phone"];
$email = $inData["email"];
$address = $inData["address"];
$contactId = $inData["contactId"];
$userId = $inData["userId"];

// Connect to database, handle error if fails
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_manager");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Update contact details in the database
    $stmt = $conn->prepare("UPDATE Contacts 
                            SET FirstName=?, LastName=?, Phone=?, Email=?, Address=?
                            WHERE ID=? AND UserID=?");
    $stmt->bind_param("ssssssi", 
        $firstName, 
        $lastName, 
        $phone, 
        $email, 
        $address, 
        $contactId, 
        $userId
    );

    if ($stmt->execute()) {
        returnWithSuccess();
    } else {
        returnWithError("Error updating contact.");
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

function returnWithSuccess()
{
    $retValue = '{"success":"Contact updated successfully."}';
    sendResultInfoAsJson($retValue);
}
?>
