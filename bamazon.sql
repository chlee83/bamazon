DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (

	item_id INT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
    
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (1, "wall clock", "Home & Kitchen", 15.50, 10),
(2, "keyboard", "Electronics", 37.15, 7),
(3, "glass plates", "Home & Kitchen", 21.42, 5),
(4, "40-inch TV", "Electronics", 210.99, 8),
(5, "notebook", "Office Products", 4.87, 25),
(6, "pen 5-pack", "Office Products", 11.99, 17),
(7, "baseball cap", "Clothing", 25.99, 9),
(8, "lotion", "Beauty & Personal Care", 19.99, 11),
(9, "Dictionary", "Books", 17.84, 15),
(10, "Microwave", "Appliances", 54.99, 4);


SELECT * FROM products;

UPDATE products SET stock_quantity = 15 WHERE item_id = 7;

DELETE FROM products WHERE item_id IS NULL;