-- ==============================================================
-- Inventory Management System - Complete SQL Script (Simple Logic)
-- Covers all tasks from 1 to 10 in model paper
-- ==============================================================

-- 1. Create Products table
CREATE TABLE Products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) CHECK (price > 0),
    added_on DATE DEFAULT CURRENT_DATE
);

-- 2. Create Suppliers table
CREATE TABLE Suppliers (
    supplier_id INT PRIMARY KEY,
    supplier_name VARCHAR(100),
    contact_email VARCHAR(100) UNIQUE,
    established_year INT CHECK (established_year >= 2000)
);

-- 3. Create StockMovements table
CREATE TABLE StockMovements (
    movement_id INT PRIMARY KEY,
    product_id INT,
    supplier_id INT,
    movement_type VARCHAR(5),  -- Only 'IN' or 'OUT'
    quantity INT CHECK (quantity > 0),
    movement_date DATE DEFAULT CURRENT_DATE,

    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id),
    CHECK (movement_type IN ('IN', 'OUT'))
);

-- 4. Insert sample data (Test Cases)

-- ✅ Valid Product
INSERT INTO Products (product_id, product_name, price, added_on) 
VALUES (1, 'Laptop', 1200.00, CURRENT_DATE);

-- ❌ Invalid Product: price <= 0
-- INSERT INTO Products (product_id, product_name, price, added_on) 
-- VALUES (2, 'Smartphone', -50.00, CURRENT_DATE);

-- ✅ Valid Supplier
INSERT INTO Suppliers (supplier_id, supplier_name, contact_email, established_year) 
VALUES (101, 'TechSupply Co.', 'contact@techsupply.com', 2010);

-- ❌ Invalid Supplier: duplicate email
-- INSERT INTO Suppliers (supplier_id, supplier_name, contact_email, established_year) 
-- VALUES (102, 'Gadget World', 'contact@techsupply.com', 2012);

-- ❌ Invalid Supplier: year < 2000
-- INSERT INTO Suppliers (supplier_id, supplier_name, contact_email, established_year) 
-- VALUES (103, 'Old Supplier', 'old@supplier.com', 1995);

-- ✅ Valid Stock Movement
INSERT INTO StockMovements (movement_id, product_id, supplier_id, movement_type, quantity, movement_date) 
VALUES (1001, 1, 101, 'IN', 50, CURRENT_DATE);

-- ❌ Invalid Movement Type
-- INSERT INTO StockMovements (movement_id, product_id, supplier_id, movement_type, quantity, movement_date) 
-- VALUES (1002, 1, 101, 'INOUT', 10, CURRENT_DATE);

-- ❌ Invalid Quantity
-- INSERT INTO StockMovements (movement_id, product_id, supplier_id, movement_type, quantity, movement_date) 
-- VALUES (1003, 1, 101, 'OUT', 0, CURRENT_DATE);

-- 5. Create index on product_id for better query performance
CREATE INDEX idx_product_id ON StockMovements(product_id);

-- 6. Query to find suppliers who supplied quantity > 50
SELECT DISTINCT S.supplier_name
FROM Suppliers S
JOIN StockMovements SM ON S.supplier_id = SM.supplier_id
WHERE SM.quantity > 50;

-- 7. Stored Procedure: Get all stock movements for a supplier by name
DELIMITER //

CREATE PROCEDURE GetStockMovementsBySupplier(IN supp_name VARCHAR(100))
BEGIN
    SELECT 
        P.product_name,
        S.supplier_name,
        SM.movement_type,
        SM.quantity,
        SM.movement_date
    FROM StockMovements SM
    JOIN Products P ON SM.product_id = P.product_id
    JOIN Suppliers S ON SM.supplier_id = S.supplier_id
    WHERE S.supplier_name = supp_name;
END //

DELIMITER ;

-- Example:
-- CALL GetStockMovementsBySupplier('TechSupply Co.');

-- 8. Query to count number of products supplied by each supplier
SELECT 
    S.supplier_name,
    COUNT(DISTINCT SM.product_id) AS total_products_supplied
FROM Suppliers S
JOIN StockMovements SM ON S.supplier_id = SM.supplier_id
GROUP BY S.supplier_name;

-- 9. Create index on quantity column
CREATE INDEX idx_quantity ON StockMovements(quantity);

-- 📌 Why this index is useful:
-- It speeds up queries like: SELECT * FROM StockMovements WHERE quantity > 100;

-- 10. Stored Procedure: Get current stock of a product
DELIMITER //

CREATE PROCEDURE GetProductStock(IN pro_id INT)
BEGIN
    SELECT 
        P.product_name,
        SUM(
            IF(SM.movement_type = 'IN', SM.quantity, -SM.quantity)
        ) AS current_stock
    FROM Products P
    JOIN StockMovements SM ON P.product_id = SM.product_id
    WHERE P.product_id = pro_id
    GROUP BY P.product_name;
END //

DELIMITER ;

-- Example:
-- CALL GetProductStock(1);
