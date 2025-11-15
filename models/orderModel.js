// models/orderModel.js
const db = require("../config/db");

// ===============================
// CREATE ORDER
// ===============================
async function createOrder(userId, total, paymentMethod) {
  const [result] = await db.query(
    "INSERT INTO orders (user_id, total_amount, payment_method) VALUES (?, ?, ?)",
    [userId, total, paymentMethod]
  );
  return result.insertId;
}

// ===============================
// ADD ORDER ITEM
// ===============================
async function addOrderItem(orderId, productId, quantity, price) {
  return db.query(
    "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
    [orderId, productId, quantity, price]
  );
}

// ===============================
// USER: GET ALL ORDERS
// ===============================
async function getUserOrders(userId) {
  const [rows] = await db.query(
    `SELECT 
        id,
        CAST(total_amount AS DECIMAL(10,2)) AS total_amount,
        created_at
     FROM orders
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

// ===============================
// USER: GET SPECIFIC ORDER
// ===============================
async function getUserOrderById(orderId, userId) {
  const [rows] = await db.query(
    `SELECT 
        id,
        CAST(total_amount AS DECIMAL(10,2)) AS total_amount,
        created_at
     FROM orders
     WHERE id = ? AND user_id = ?`,
    [orderId, userId]
  );
  return rows[0] || null;
}

// ===============================
// GET ORDER ITEMS (shared for admin & user)
// ===============================
async function getOrderItems(orderId) {
  const [rows] = await db.query(
    `SELECT 
        oi.product_id,
        p.name,
        p.image,
        oi.quantity,
        oi.price
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = ?`,
    [orderId]
  );
  return rows;
}

// ===============================
// ADMIN: GET ALL ORDERS
// ===============================
async function getAllOrders() {
  const [rows] = await db.query(
    `SELECT 
        o.id AS order_id,
        u.username,
        u.email,
        CAST(o.total_amount AS DECIMAL(10,2)) AS total_amount,
        o.created_at
     FROM orders o
     JOIN users u ON o.user_id = u.id
     ORDER BY o.created_at DESC`
  );
  return rows;
}

// ===============================
// ADMIN: GET SPECIFIC ORDER (with user)
async function getAdminOrderById(orderId) {
  const [rows] = await db.query(
    `SELECT 
        o.id AS order_id,
        CAST(o.total_amount AS DECIMAL(10,2)) AS total_amount,
        o.created_at,
        u.username,
        u.email
     FROM orders o
     JOIN users u ON o.user_id = u.id
     WHERE o.id = ?`,
    [orderId]
  );
  return rows[0] || null;
}

// ===============================
// USED WHEN DELETING A USER
// ===============================
async function getUserPurchases(userId) {
  const [rows] = await db.query(
    `SELECT 
        id AS order_id,
        CAST(total_amount AS DECIMAL(10,2)) AS total_amount,
        created_at
     FROM orders
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

module.exports = {
  createOrder,
  addOrderItem,
  getUserOrders,
  getUserOrderById,
  getOrderItems,
  getAllOrders,
  getAdminOrderById,
  getUserPurchases,
};
