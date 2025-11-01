-- =======================================
-- DATABASE: FURNI
-- =======================================
CREATE DATABASE IF NOT EXISTS furni_db;
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

-- =======================================
-- 2. ORDERS
-- =======================================
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    message TEXT,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    total_price DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('pending','confirmed','delivered','cancelled') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =======================================
-- 3. ORDER_ITEMS
-- =======================================
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price_each DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE
);

-- =======================================
-- 4. ADMIN_USERS
-- =======================================
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','editor') DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
