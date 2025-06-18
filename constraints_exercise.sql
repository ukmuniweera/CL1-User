mysql -u root -p

DROP DATABASE IF EXISTS Practical;

CREATE DATABASE Practical;

USE Practical;

-- 1
CREATE TABLE Employees ( 
    EmpID INT NOT NULL, 
    Name VARCHAR(50) NOT NULL, 
    Department VARCHAR(30), 
    PRIMARY KEY (EmpID) 
); 

INSERT INTO Employees()
VALUES (NULL, 'John', 'HR');

INSERT INTO Employees
VALUES (2, NULL, 'Finance');

-- 2
CREATE TABLE Products ( 
    ProductID INT NOT NULL, 
    ProductName VARCHAR(50) NOT NULL, 
    Price DECIMAL(10, 2) CHECK (Price > 0), 
    PRIMARY KEY (ProductID) 
); 

INSERT INTO Products
VALUES (1, 'Pen', -10);

INSERT INTO Products
VALUES (2, 'Pencil', 0);

INSERT INTO Products
VALUES (3, 'Book', 20);

-- 3
CREATE TABLE Students ( 
    StudentID INT NOT NULL, 
    Name VARCHAR(50) NOT NULL, 
    Age INT CHECK (Age >= 18), 
    Marks INT, 
    CONSTRAINT Check_Marks CHECK (Marks BETWEEN 0 AND 100), 
    PRIMARY KEY (StudentID) 
); 

INSERT INTO Students 
VALUES (1, 'Nimal', 17, 80);

INSERT INTO Students 
VALUES (2, 'Bimal', 20, 105);

INSERT INTO Students 
VALUES (3, 'Kamal', 25, 100);

-- 4
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    OrderStatus VARCHAR(20) DEFAULT 'Pending',
    CreatedDate DATE DEFAULT CURRENT_DATE
);

INSERT INTO Orders (OrderID) 
VALUES (1);

SELECT * FROM Orders;

-- 5
CREATE TABLE Customers (
    ID INT PRIMARY KEY,
    Name VARCHAR(50),
    City VARCHAR(50),
    Salary DECIMAL(10, 2)
);

INSERT INTO Customers 
VALUES
(1, 'Ramesh', 'Delhi', 5000),
(2, 'Anil', 'Anil', NULL),
(3, 'Sunita', NULL, 7000);

SELECT ID, NULLIF(Name, City) AS Result 
FROM Customers;

SELECT ID, Name, IFNULL(Salary, 5500) AS EffectiveSalary 
FROM Customers;

-- 6
CREATE TABLE Vehicles (
    VehicleID INT PRIMARY KEY,
    Model VARCHAR(50),
    Year INT
);

ALTER TABLE Vehicles
ADD CONSTRAINT Check_Year CHECK (Year >= 2000);

INSERT INTO Vehicles
VALUES (1, 'Model 1', 1995);

ALTER TABLE Vehicles
DROP CONSTRAINT Check_Year;

-- 7
CREATE TABLE Users (
    UserID INT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE,
    Email VARCHAR(100) UNIQUE
);

INSERT INTO Users
VALUES (1, 'User 1', 'user@mail.com');

INSERT INTO Users
VALUES (2, 'User 1', 'user@mail.com');
