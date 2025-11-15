// models/cartModel.js
const db = require("../config/db");

// ===============================
// GET USER CART ITEMS
// ===============================
async function getCartItems(userId) {
  const [rows] = await db.query(
    `SELECT 
        p.id AS product_id, 
        p.name, 
        CAST(p.price AS DECIMAL(10,2)) AS price,
        p.image, 
        c.quantity
     FROM cart c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?`,
    [userId]
  );

  return rows.map((i) => ({
    ...i,
    price: Number(i.price),
  }));
}

// ===============================
// FIND SINGLE CART ITEM
// ===============================
async function findCartItem(userId, productId) {
  const [rows] = await db.query(
    "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
    [userId, productId]
  );
  return rows[0] || null;
}

// ===============================
// ADD NEW ITEM
// ===============================
async function addCartItem(userId, productId, quantity) {
  return db.query(
    "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
    [userId, productId, quantity]
  );
}

// ===============================
// INCREASE EXISTING ITEM QTY
// ===============================
async function incrementCartItem(userId, productId, quantity) {
  return db.query(
    "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
    [quantity, userId, productId]
  );
}

// ===============================
// UPDATE ITEM QUANTITY
// ===============================
async function updateCartItem(userId, productId, quantity) {
  return db.query(
    "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
    [quantity, userId, productId]
  );
}

// ===============================
// DELETE CART ITEM
// ===============================
async function removeCartItem(userId, productId) {
  return db.query("DELETE FROM cart WHERE user_id = ? AND product_id = ?", [
    userId,
    productId,
  ]);
}

// ===============================
// GET ITEMS FOR CHECKOUT
// ===============================
async function getCheckoutItems(userId) {
  const [rows] = await db.query(
    `SELECT 
         c.quantity, 
         c.product_id,
         p.name, 
         CAST(p.price AS DECIMAL(10,2)) AS price,
         p.image
     FROM cart c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = ?`,
    [userId]
  );

  return rows;
}

// ===============================
// CLEAR USER CART
// ===============================
async function clearCart(userId) {
  return db.query("DELETE FROM cart WHERE user_id = ?", [userId]);
}

module.exports = {
  getCartItems,
  findCartItem,
  addCartItem,
  incrementCartItem,
  updateCartItem,
  removeCartItem,
  getCheckoutItems,
  clearCart,
};
