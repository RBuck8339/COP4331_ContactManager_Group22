<?php
session_start();

// Check if user session exists
if (!isset($_SESSION['userId'])) {
    // Redirect to login page if user is not logged in
    header("Location: ../login");
    exit();
}

// Optional: Return session data to frontend
echo json_encode([
    "userId" => $_SESSION['userId'],
    "firstName" => $_SESSION['firstName'],
    "lastName" => $_SESSION['lastName']
]);
?>
