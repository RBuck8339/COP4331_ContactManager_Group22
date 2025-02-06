<?php
    $inData = getRequestInfo();

    $userId = $inData["userId"];
    $searchQuery = $inData["search"] . "%";
    $searchResults = [];
    
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_manager");

    if ($conn->connect_error) {
        returnWithError("Database connection failed: " . $conn->connect_error);
    } else {
        $stmt = $conn->prepare("
            SELECT ID, FirstName, LastName, Phone, Email, Address 
            FROM Contacts 
            WHERE UserID = ? 
            AND (
                FirstName LIKE CONCAT(?, '%') 
                OR LastName LIKE CONCAT(?, '%') 
                OR Email LIKE CONCAT(?, '%') 
                OR Phone LIKE CONCAT('%', ?, '%')
            )
        ");
    
        $stmt->bind_param("sssss", $userId, $searchQuery, $searchQuery, $searchQuery, $searchQuery);
        $stmt->execute();
        $result = $stmt->get_result();
    
        while ($row = $result->fetch_assoc()) {
            $searchResults[] = [
                "contactId" => $row["ID"],
                "firstName" => $row["FirstName"],
                "lastName" => $row["LastName"],
                "phone" => $row["Phone"],
                "email" => $row["Email"],
                "address" => $row["Address"]
            ];
        }
    
        if (empty($searchResults)) {
            returnWithError("No Records Found");
        } else {
            returnWithInfo($searchResults);
        }
    
        $stmt->close();
        $conn->close();
    }

    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj) {
        header('Content-Type: application/json');
        echo json_encode($obj);
    }

    function returnWithError($err) {
        sendResultInfoAsJson(["error" => $err]);
    }

    function returnWithInfo($results) {
        sendResultInfoAsJson(["results" => $results, "error" => ""]);
    }
?>
