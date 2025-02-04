<?php

	$inData = getRequestInfo();

	$userId = $inData["userId"];
	$searchQuery = $inData["search"] . "%"; // Matches only values that START with the search term
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331","contact_manager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
    	//find contact that shares elements in FirstName stored in the database to prepare function
		// - First Name, Last Name, Email → must start with the input (`LIKE 's%'`)
		// - Phone → must contain the input (`LIKE '%123%'` for partial matches)
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
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"firstName" : "' . $row["FirstName"] . '", "lastName" : "' . $row["LastName"] . '", "phone" : "' . $row["Phone"] . '", "email" : "' . $row["Email"] . '", "address" : "' . $row["Address"] . '", "contactId" : "' . $row["ID"] . '"}'; 
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
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
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
