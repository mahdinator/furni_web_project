const mysql = require("mysql2/promise");

(async () => {
  try {
    console.log("⏳ Trying to connect to MySQL...");

    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "H@s@n1234",
      database: "furni_db",
      port: 3306,
      connectTimeout: 5000, // 5 seconds timeout
    });

    console.log("✅ Connected successfully!");
    const [rows] = await conn.query("SELECT DATABASE() AS db;");
    console.log("Current DB:", rows[0].db);
    await conn.end();
  } catch (err) {
    console.error("❌ Connection failed!");
    console.error("Full error details:\n", err);
  }
})();
