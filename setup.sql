-- create the databases
CREATE DATABASE IF NOT EXISTS activities;

-- create the users for each database
CREATE USER 'localhost'@'%' IDENTIFIED BY '';
GRANT CREATE, ALTER, INDEX, LOCK TABLES, REFERENCES, UPDATE, DELETE, DROP, SELECT, INSERT ON `activities`.* TO 'localhost'@'%';

FLUSH PRIVILEGES;