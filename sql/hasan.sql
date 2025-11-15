/**********************************************************************************************
*  DATABASE: furni_db
*  DESCRIPTION: Full schema for users, products, cart, orders, order_items, and admin logs.
**********************************************************************************************/

-- Create and select database
CREATE DATABASE furni_db;
USE furni_db;


-- =======================================
-- 1. PRODUCTS
-- =======================================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    image VARCHAR(255),
    model3d VARCHAR(255),
    category VARCHAR(50),
    quantity INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

/**********************************************************************************************
*  USERS TABLE
**********************************************************************************************/
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    suspended TINYINT(1) NOT NULL DEFAULT 0
);

-- Insert initial admin user
INSERT INTO users (username, email, password, role)
VALUES ('hasann', 'annan@gmail.com',
        '$2b$10$5HnvNaLHjKrzommuBanTFuMWV1.zZt6fvU.ZoOMZczodZ2ar4n0XG', 'admin');

SELECT * FROM users;

/**********************************************************************************************
*  CART TABLE
*  Items currently added to user shopping carts
**********************************************************************************************/
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

/**********************************************************************************************
*  ORDERS TABLE
*  Stores completed transactions
**********************************************************************************************/
DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'none',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/**********************************************************************************************
*  ORDER_ITEMS TABLE
*  Items included inside each orderr
**********************************************************************************************/
DROP TABLE IF EXISTS order_items;

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

/**********************************************************************************************
*  RECALCULATE TOTAL AMOUNT FOR ALL ORDERS
**********************************************************************************************/
SET SQL_SAFE_UPDATES = 0;

UPDATE orders o
JOIN (
    SELECT 
        order_id,
        SUM(quantity * price) AS real_total
    FROM order_items
    GROUP BY order_id
) AS calc ON o.id = calc.order_id
SET o.total_amount = calc.real_total;

/**********************************************************************************************
*  ADMIN LOGS TABLE
*  Stores admin actions for auditing
**********************************************************************************************/
CREATE TABLE admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

/**********************************************************************************************
*  TESTING 
**********************************************************************************************/

-- View essential user fields
SELECT id, username, role, suspended FROM users;

-- Suspend a user example
UPDATE users 
SET suspended = 1 
WHERE id = 5;

-- Reset orders table (safe usage)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE orders;
SET FOREIGN_KEY_CHECKS = 1;
