// db.js
const mysql = require("mysql2/promise");

// use createPool instead of createConnection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "P@ssw0rd",
  database: "furni_db",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
