<?php
session_start();

// Destroy all sessions
session_unset(); // Remove all session variables
session_destroy(); // Destroy the session

// Redirect to login page
header("Location: ../login.html");
exit();
?>
