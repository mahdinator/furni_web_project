const db = require("../config/db");
const bcrypt = require("bcrypt");

// ========================================
// 🔹 REGISTER NEW USER
// ========================================
exports.registerUser = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO users (username, email, password, role, suspended)
    VALUES (?, ?, ?, 'user', 0)
  `;

  await db.query(sql, [username, email, hashedPassword]);
};

// ========================================
// 🔹 FIND USER BY EMAIL (supports suspension)
// ========================================
exports.findUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT id, username, email, password, role, suspended FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
};

// ========================================
// 🔹 GET ALL USERS (for Admin Dashboard)
// ========================================
exports.getAllUsers = async () => {
  const [rows] = await db.query(
    "SELECT id, username, email, role, suspended FROM users"
  );
  return rows;
};

// ========================================
// 🔹 UPDATE USER ROLE (Promote / Demote)
// ========================================
exports.updateUserRole = async (id, role) => {
  await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
};

// ========================================
// 🔹 UPDATE SUSPENDED STATUS (Suspend / Unsuspend)
// ========================================
exports.updateSuspendedStatus = async (id, suspended) => {
  await db.query("UPDATE users SET suspended = ? WHERE id = ?", [suspended, id]);
};

// ========================================
// 🔹 DELETE USER
// ========================================
exports.deleteUser = async (id) => {
  await db.query("DELETE FROM users WHERE id = ?", [id]);
};

// ========================================
// 🔹 COUNT ADMINS
// ========================================
exports.countAdmins = async () => {
  const [rows] = await db.query(
    "SELECT COUNT(*) AS count FROM users WHERE role = 'admin'"
  );
  return rows[0].count;
};

// ========================================
// 🔹 FIND USER BY ID
// ========================================
exports.findUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, username, email, role, suspended FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
};

// ========================================
// 🔹 GET USER PURCHASE HISTORY
// ========================================
exports.getUserPurchases = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT
      o.id AS order_id,
      o.total,
      o.created_at,
      p.name AS product_name,
      p.price AS product_price,
      oi.quantity AS qty
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
    `,
    [userId]
  );
  return rows;
};

// ========================================
// 🔹 RESET PASSWORD
// ========================================
exports.resetPassword = async (id, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);
  await db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, id]);
  return true;
};
