// furni_web_project-master/config/db.js
const mysql = require("mysql2/promise");

// Create a connection pool
const db = mysql.createPool({
  host: "localhost", // or "localhost"
  user: "root", // MySQL username
  password: "P@ssw0rd", //your password here
  database: "furni_db", // make sure this DB exists
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Quick connection test on startup
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("✅ Connected to MySQL database successfully.");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
  }
})();

module.exports = db;
