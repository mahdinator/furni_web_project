const db = require("../config/db");

// Save admin action
exports.logAction = async (admin_id, action, details = "") => {
  await db.query(
    "INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)",
    [admin_id, action, details]
  );
};

// Get all logs (newest first)
exports.getAllLogs = async () => {
  const [rows] = await db.query(
    `SELECT 
        admin_logs.*, 
        users.username AS admin_name 
     FROM admin_logs
     JOIN users ON users.id = admin_logs.admin_id
     ORDER BY admin_logs.created_at DESC`
  );
  return rows;
};
