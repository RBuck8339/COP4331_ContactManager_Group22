-- Create the database
CREATE DATABASE IF NOT EXISTS contact_manager;

-- Use the database
USE contact_manager;

-- Create Users Table
CREATE TABLE `Users` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `FirstName` VARCHAR(50) NOT NULL DEFAULT '',
    `LastName` VARCHAR(50) NOT NULL DEFAULT '',
    `Login` VARCHAR(50) NOT NULL DEFAULT '',
    `Password` VARCHAR(50) NOT NULL DEFAULT '',
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB;

-- Create Contacts Table
CREATE TABLE `Contacts` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `FirstName` VARCHAR(50) NOT NULL DEFAULT '',
    `LastName` VARCHAR(50) NOT NULL DEFAULT '',
    `Phone` VARCHAR(50) NOT NULL DEFAULT '',
    `Email` VARCHAR(50) NOT NULL DEFAULT '',
    `UserID` INT NOT NULL DEFAULT '0',
    `Address` VARCHAR(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB;

-- Populate working data rows in Users table
INSERT INTO `Users` (`FirstName`, `LastName`, `Login`, `Password`)
VALUES
    ('Rick', 'Leinecker', 'RickL', 'COP4331'),
    ('Sam', 'Hill', 'SamH', 'Test'),
    ('Rick', 'Leinecker', 'RickL', '5832a7136676809eccb7095efb774f2'),
    ('Sam', 'Hill', 'SamH', '0cbc6611f554fb0bd0809a388dc95a15b');
