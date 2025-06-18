mysql -u root -p

DROP DATABASE IF EXISTS Practical;

CREATE DATABASE Practical;

USE Practical;

-- 1 
DELIMITER //
CREATE PROCEDURE GetCustomerByName(IN cust_name VARCHAR(255))
BEGIN
    SELECT * FROM Customers WHERE Name = cust_name;
END;
//
DELIMITER ;

CALL GetCustomerByName('Ramesh');

-- 2
DELIMITER //
CREATE PROCEDURE AddCustomer(
    IN p_id INT, 
    IN p_name VARCHAR(25), 
    IN p_age INT, 
    IN p_address VARCHAR(50), 
    IN p_salary DECIMAL(10,4)
)
BEGIN
    INSERT INTO Customers (Id, Name, Age, Address, Salary)
    VALUES (p_id, p_name, p_age, p_address, p_salary);
END;
//
DELIMITER ;

CALL AddCustomer(21, 'Hardik', 34, 'Bhopal', 7200.0000);

CALL AddCustomer(22, 'Anil', 28, 'Kolkata', 5000.0000);

SELECT * FROM Customers;

-- 3
DELIMITER //
CREATE PROCEDURE RaiseSalary(
    IN p_id INT, 
    IN pct DECIMAL(5,2)
)
BEGIN
    UPDATE Customers
    SET Salary = Salary + (Salary * pct / 100)
    WHERE Id = p_id;
END;
//
DELIMITER ;

CALL RaiseSalary(3, 15.0);

SELECT Salary 
FROM Customers 
WHERE Id = 3;

-- 4
DELIMITER //
CREATE PROCEDURE CountByAge(
    IN p_age INT, 
    OUT total_count INT
)
BEGIN
    SELECT COUNT(*) INTO total_count
    FROM Customers
    WHERE Age = p_age;
END;
//
DELIMITER ;

CALL CountByAge(25, @cnt);

SELECT @cnt;

-- 5
DELIMITER //
CREATE PROCEDURE SwapSalaries (
    INOUT id1 INT, 
    INOUT id2 INT
)
BEGIN
    DECLARE sal1 DECIMAL(10,4);
    DECLARE sal2 DECIMAL(10,4);

    SELECT Salary INTO sal1 FROM Customers WHERE Id = id1;
    SELECT Salary INTO sal2 FROM Customers WHERE Id = id2;

    UPDATE Customers SET Salary = sal2 WHERE Id = id1;
    UPDATE Customers SET Salary = sal1 WHERE Id = id2;
END;
//
DELIMITER ;

SET @id1 = 5;

SET @id2 = 6;

SELECT Id, Salary FROM Customers WHERE Id IN (@id1, @id2);

CALL SwapSalaries(@id1, @id2);

SELECT Id, Salary FROM Customers WHERE Id IN (@id1, @id2);

-- 6
DELIMITER //
CREATE PROCEDURE DeleteByAge (
    IN p_age INT
)
BEGIN
    DELETE FROM Customers WHERE Age = p_age;
END;
//
DELIMITER ;

CALL DeleteByAge(25);

SELECT * FROM Customers WHERE Age = 25;
