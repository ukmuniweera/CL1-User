INSERT INTO categorey (id, name)
VALUES
    (1, 'Edibles Items'),
    (2, 'Handicraft Item'),
    (3, 'Kitchen Tool'),
    (4, 'Uncategorized');
	
INSERT INTO customer (id, address, email, name, credit_card_no, shipping_address)
VALUES
    ('C001', '123 Palm Street, Jaffna', 'koilns@example.com', 'J.P Kolins', '1111-2222-3333-4444', '123 Palm Street, Jaffna'),
    ('C002', '456 Coconut Avenue, Jaffna', 'kajan@example.com', 'K.Kajanthan', '5555-6666-7777-8888', '21 Palm Plaza, Jaffna');

	
INSERT INTO seller (id, address, email, name, company_name, contact_info)
VALUES
    ('S001', '78 Palmyrah Lane, Jaffna', 'phw@example.com', 'S.Indranee', 'Palmyrah Handicrafts World', '123-456-7890'),
    ('S002', '56 Crafts Road, Kilinochchi', 'katpagatharu@example.com', 'K.Yathusha', 'Katpagatharu', '987-654-3210'),
    ('S003', '99 Palm Plaza, Mullaitivu', 'iam@example.com', 'N.Jeevarani', 'Iam', '555-111-2222');
	
INSERT INTO product (id, description, name, price, categorey_id, seller_id,stock)
VALUES
    (101, 'Handwoven palm leaf basket', 'Palm Basket', 150.00, 2, 'S001',20),
    (102, 'Traditional Palmyrah mat', 'Palmyrah Mat', 2500.00, 2, 'S001',5),
    (103, 'Stylish Palmyrah handbag', 'Palmyrah Handbag', 3525.50, 2, 'S002',6),
    (104, 'Palmyrah toy car', 'Palmyrah Toy Car', 1000.00, 4, 'S003',10),
    (105, 'Palm jaggery is an excellent substitute for white sugar.', 'Palmyra Jaggery', 1369.00, 1, 'S003',8),
    (106, 'Freshly harvested tubers are boiled for about half an hour after cleaning the outer casing and base roots.', 'Palmyrah Boiled Tuber Chips', 1600.00, 1, 'S003',18),
    (107, 'Traditional palmyra leaf Winnower (Sulaku) is an assortment of every womans kitchen trove.', 'Palmyra Leaf winnower (Sulaku)', 1800.00, 3, 'S002',18);
	