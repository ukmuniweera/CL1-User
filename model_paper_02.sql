-- Create and use the database
CREATE DATABASE IF NOT EXISTS InventoryDB;
USE InventoryDB;

-- --------------------------------------
-- 1. Create Products table
-- --------------------------------------
CREATE TABLE Products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) CHECK (price > 0),
    added_on DATE DEFAULT CURRENT_DATE
);

-- --------------------------------------
-- 2. Create Suppliers table
-- --------------------------------------
CREATE TABLE Suppliers (
    supplier_id INT PRIMARY KEY,
    supplier_name VARCHAR(100),
    contact_email VARCHAR(100) UNIQUE,
    established_year INT CHECK (established_year >= 2000)
);

-- --------------------------------------
-- 3. Create StockMovements table
-- --------------------------------------
CREATE TABLE StockMovements (
    movement_id INT PRIMARY KEY,
    product_id INT,
    supplier_id INT,
    movement_type ENUM('IN', 'OUT'),
    quantity INT CHECK (quantity > 0),
    movement_date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id)
);

-- --------------------------------------
-- 4. Insert sample data
-- --------------------------------------
INSERT INTO Products (product_id, product_name, price, added_on) VALUES
(1, 'Laptop', 1200.00, CURRENT_DATE),
(2, 'Smartphone', 800.00, CURRENT_DATE),
(3, 'Tablet', 450.00, CURRENT_DATE),
(4, 'Monitor', 250.00, CURRENT_DATE),
(5, 'Keyboard', 40.00, CURRENT_DATE),
(6, 'Mouse', 25.00, CURRENT_DATE),
(7, 'Printer', 150.00, CURRENT_DATE),
(8, 'Router', 90.00, CURRENT_DATE),
(9, 'Webcam', 60.00, CURRENT_DATE),
(10, 'External HDD', 110.00, CURRENT_DATE);

INSERT INTO Suppliers (supplier_id, supplier_name, contact_email, established_year) VALUES
(101, 'TechSupply Co.', 'contact@techsupply.com', 2010),
(102, 'Gadget World', 'info@gadgetworld.com', 2012),
(103, 'ElectroMart', 'sales@electromart.com', 2015),
(104, 'Digital Source', 'hello@digitalsource.com', 2020),
(105, 'Hardware Hub', 'support@hardwarehub.com', 2005),
(106, 'Modern Tech', 'contact@moderntech.com', 2018),
(107, 'Device Depot', 'info@devicedepot.com', 2003),
(108, 'Peripheral Plus', 'contact@peripheralplus.com', 2021),
(109, 'NextGen Supplies', 'sales@nextgensupplies.com', 2016),
(110, 'CompuWorld', 'info@compuworld.com', 2008);

INSERT INTO StockMovements (movement_id, product_id, supplier_id, movement_type, quantity, movement_date) VALUES
(1001, 1, 101, 'IN', 50, CURRENT_DATE),
(1002, 2, 102, 'IN', 100, CURRENT_DATE),
(1003, 3, 103, 'IN', 70, CURRENT_DATE),
(1004, 4, 104, 'IN', 30, CURRENT_DATE),
(1005, 5, 105, 'IN', 150, CURRENT_DATE),
(1006, 6, 106, 'IN', 90, CURRENT_DATE),
(1007, 7, 107, 'OUT', 10, CURRENT_DATE),
(1008, 8, 108, 'OUT', 5, CURRENT_DATE),
(1009, 9, 109, 'OUT', 20, CURRENT_DATE),
(1010, 10, 110, 'OUT', 15, CURRENT_DATE);

-- --------------------------------------
-- 5. Create indexes
-- --------------------------------------
CREATE INDEX idx_products_name ON Products(product_name);
CREATE INDEX idx_stock_product_movement ON StockMovements(product_id, movement_type);
CREATE UNIQUE INDEX idx_supplier_name_unique ON Suppliers(supplier_name);

-- --------------------------------------
-- 6. Drop index
-- --------------------------------------
DROP INDEX idx_products_name ON Products;

-- --------------------------------------
-- 7. Show indexes on StockMovements
-- --------------------------------------
SHOW INDEX FROM StockMovements;

-- --------------------------------------
-- 8. Stored Procedures
-- --------------------------------------
DELIMITER //

-- Total stock IN
CREATE OR REPLACE PROCEDURE TotalStockIn(IN p_id INT, OUT total_in INT)
BEGIN
    SELECT SUM(quantity) INTO total_in
    FROM StockMovements
    WHERE product_id = p_id AND movement_type = 'IN';
END;
//

-- Total stock OUT
CREATE OR REPLACE PROCEDURE TotalStockOut(IN p_id INT, OUT total_out INT)
BEGIN
    SELECT SUM(quantity) INTO total_out
    FROM StockMovements
    WHERE product_id = p_id AND movement_type = 'OUT';
END;
//

-- Net stock balance = IN - OUT
CREATE OR REPLACE PROCEDURE NetStockBalance(IN p_id INT, OUT net_stock INT)
BEGIN
    DECLARE in_qty INT DEFAULT 0;
    DECLARE out_qty INT DEFAULT 0;

    CALL TotalStockIn(p_id, in_qty);
    CALL TotalStockOut(p_id, out_qty);

    SET net_stock = IFNULL(in_qty, 0) - IFNULL(out_qty, 0);
END;
//

-- ✅ Fixed version: Insert new stock movement (no self-reference)
CREATE OR REPLACE PROCEDURE InsertStockMovement(IN p_id INT, IN qty INT, IN m_type VARCHAR(10))
BEGIN
    DECLARE new_id INT;
    DECLARE supp_id INT;

    -- Get new movement ID
    SELECT IFNULL(MAX(movement_id), 1000) + 1 INTO new_id FROM StockMovements;

    -- Get supplier_id before using in INSERT
    SELECT supplier_id INTO supp_id
    FROM StockMovements
    WHERE product_id = p_id
    LIMIT 1;

    -- Insert new stock record
    INSERT INTO StockMovements (movement_id, product_id, supplier_id, movement_type, quantity, movement_date)
    VALUES (new_id, p_id, supp_id, m_type, qty, CURRENT_DATE);
END;
//

-- Update product price
CREATE OR REPLACE PROCEDURE UpdateProductPrice(IN p_id INT, IN new_price DECIMAL(8,2))
BEGIN
    UPDATE Products SET price = new_price WHERE product_id = p_id;
END;
//

-- Count products by supplier ID
CREATE OR REPLACE PROCEDURE SupplierProductCount(IN s_id INT, OUT product_count INT)
BEGIN
    SELECT COUNT(DISTINCT product_id) INTO product_count
    FROM StockMovements
    WHERE supplier_id = s_id;
END;
//

-- Count products by supplier name
CREATE OR REPLACE PROCEDURE ProductsBySupplier(IN s_name VARCHAR(100), OUT total INT)
BEGIN
    SELECT COUNT(DISTINCT sm.product_id) INTO total
    FROM StockMovements sm
    JOIN Suppliers s ON sm.supplier_id = s.supplier_id
    WHERE s.supplier_name = s_name;
END;
//

-- Adjust supplier ID if less than 1000
CREATE OR REPLACE PROCEDURE AdjustSupplierID(INOUT s_id INT)
BEGIN
    IF s_id < 1000 THEN
        SET s_id = s_id + 1000;
    END IF;
END;
//

-- View all stock movements for a product
CREATE OR REPLACE PROCEDURE StockMovementsByProduct(IN p_id INT)
BEGIN
    SELECT * FROM StockMovements WHERE product_id = p_id;
END;
//

-- Delete all stock movements of a product
CREATE OR REPLACE PROCEDURE DeleteStockByProduct(IN p_id INT)
BEGIN
    DELETE FROM StockMovements WHERE product_id = p_id;
END;
//

DELIMITER ;

-- --------------------------------------
-- 9. Procedure Testing (optional)
-- --------------------------------------
CALL TotalStockIn(1, @in); SELECT @in;
CALL TotalStockOut(1, @out); SELECT @out;
CALL NetStockBalance(1, @net); SELECT @net;
CALL InsertStockMovement(1, 20, 'IN');
CALL UpdateProductPrice(1, 1300.00);
CALL SupplierProductCount(101, @count); SELECT @count;
CALL ProductsBySupplier('TechSupply Co.', @total); SELECT @total;
SET @sid = 500; CALL AdjustSupplierID(@sid); SELECT @sid;
CALL StockMovementsByProduct(1);
CALL DeleteStockByProduct(10);
