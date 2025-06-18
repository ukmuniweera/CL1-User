mysql -u root -p

DROP DATABASE IF EXISTS Practical;

CREATE DATABASE Practical;

USE Practical;

-- 1
CREATE TABLE Customers ( 
    Id INT NOT NULL, 
    Name VARCHAR(15) NOT NULL, 
    Age INT NOT NULL, 
    Address VARCHAR(25), 
    Salary DECIMAL(10, 4), 
    PRIMARY KEY(Id) 
);

INSERT INTO Customers VALUES 
(1, 'Ramesh', 32, 'Ahmedabad', 2000), 
(2, 'Khilan', 25, 'Delhi', 1500), 
(3, 'Kaushik', 23, 'Kota', 2000), 
(4, 'Chaitali', 25, 'Mumbai', 6500), 
(5, 'Hardik', 27, 'Bhopal', 8500), 
(6, 'Komal', 22, 'Indore', 4500), 
(7, 'Muffy', 24, 'Pune', 10000), 
(8, 'Divya', 29, 'Jaipur', 7200), 
(9, 'Raj', 31, 'Chennai', 9200), 
(10, 'Sneha', 28, 'Kolkata', 5500), 
(11, 'Arjun', 30, 'Hyderabad', 6100), 
(12, 'Meena', 26, 'Lucknow', 4700), 
(13, 'Vijay', 34, 'Patna', 3900), 
(14, 'Pooja', 23, 'Ranchi', 3200), 
(15, 'Ravi', 35, 'Surat', 9800), 
(16, 'Nisha', 27, 'Vadodara', 8100), 
(17, 'Anil', 30, 'Nagpur', 5300), 
(18, 'Geeta', 21, 'Amritsar', 3600), 
(19, 'Suresh', 33, 'Noida', 6600), 
(20, 'Lakshmi', 29, 'Trivandrum', 7300);

SELECT * FROM Customers;

-- 2
CREATE INDEX Index_Name ON Customers(Name);

CREATE INDEX Index_Name_Age ON Customers(Name, Age);

SHOW INDEX FROM Customers;

-- 3
CREATE UNIQUE INDEX Index_Address ON Customers(Address);

INSERT INTO Customers VALUES 
(21, 'Biksu', 36, 'Ahmedabad', 6000);

-- 4
DROP INDEX Index_Name ON Customers;

DROP INDEX Index_Name_Age ON Customers;

SHOW INDEX FROM Customers;
