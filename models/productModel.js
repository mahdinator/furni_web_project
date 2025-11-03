const db = require("../db");

exports.getFeatured = async () => {
  const [rows] = await db.query(
    "SELECT * FROM products WHERE is_featured = TRUE AND quantity > 0 ORDER BY created_at DESC"
  );
  return rows;
};

exports.getFiltered = async ({ category, min = 1, max = 5000 }) => {
  let sql = "SELECT * FROM products WHERE price BETWEEN ? AND ?";
  const values = [min, max];
  if (category) {
    sql += " AND category = ?";
    values.push(category);
  }
  const [rows] = await db.execute(sql, values);
  return rows;
};

exports.getByIds = async (ids) => {
  if (!ids.length) return [];
  const placeholders = ids.map(() => "?").join(",");
  const [rows] = await db.query(
    `SELECT * FROM products WHERE id IN (${placeholders})`,
    ids
  );
  return rows;
};
