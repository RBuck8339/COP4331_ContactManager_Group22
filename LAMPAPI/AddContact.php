<?php
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $address = $inData["address"];
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_manager");

    if ($conn->connect_error) {
        returnWithError("Database connection failed: " . $conn->connect_error);
    } else {
        // Check if contact with the same First Name and Last Name exists for this user
        $stmt = $conn->prepare("SELECT ID FROM Contacts WHERE FirstName=? AND LastName=? AND UserID=?");
        $stmt->bind_param("ssi", $firstName, $lastName, $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            returnWithError("Contact already exists with the same First Name and Last Name.");
        } else {
            // Insert new contact if no duplicate exists
            $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, Address, UserID) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssi", $firstName, $lastName, $phone, $email, $address, $userId);
            $stmt->execute();
            returnWithSuccess("Contact added successfully.");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo json_encode($obj);
    }

    function returnWithError($err) {
        sendResultInfoAsJson(["error" => $err]);
    }

    function returnWithSuccess($message) {
        sendResultInfoAsJson(["success" => true, "message" => $message]);
    }
?>
