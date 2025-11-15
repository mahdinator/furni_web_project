const db = require("../config/db");

//Get featured products
exports.getFeatured = async () => {
  const [rows] = await db.query(
    "SELECT * FROM products WHERE is_featured = TRUE AND quantity > 0 ORDER BY created_at DESC"
  );
  return rows;
};

//Get filtered products (used in shop)
exports.getFiltered = async ({ category, min = 1, max = 9999 }) => {
  let sql = "SELECT * FROM products WHERE price BETWEEN ? AND ?";
  const values = [min, max];

  if (category && category.trim() !== "") {
    sql += " AND category = ?";
    values.push(category);
  }

  const [rows] = await db.query(sql, values);
  return rows;
};

//Get all products (for admin dashboard)
exports.getAll = async () => {
  const [rows] = await db.query(
    "SELECT * FROM products ORDER BY created_at DESC"
  );
  return rows;
};

//Add new product (FIXED: added name + validation)
exports.addProduct = async (product) => {
  const {
    name,
    description,
    price,
    image,
    model3d,
    category,
    quantity,
    is_featured,
  } = product;

  if (!name || !description || !price || !quantity) {
    throw new Error("Missing required product fields");
  }

  const sql = `
    INSERT INTO products (name, description, price, image, model3d, category, quantity, is_featured, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;
  await db.query(sql, [
    name,
    description,
    parseFloat(price),
    image || "default.png",
    model3d || "",
    category || "Uncategorized",
    parseInt(quantity),
    is_featured ? 1 : 0,
  ]);
};

//Update product
exports.updateProduct = async (id, product) => {
  const {
    name,
    description,
    price,
    image,
    model3d,
    category,
    quantity,
    is_featured,
  } = product;

  const sql = `
    UPDATE products 
    SET name=?, description=?, price=?, image=?, model3d=?, category=?, quantity=?, is_featured=? 
    WHERE id=?
  `;
  await db.query(sql, [
    name,
    description,
    parseFloat(price),
    image,
    model3d,
    category,
    parseInt(quantity),
    is_featured ? 1 : 0,
    id,
  ]);
};

//Delete product
exports.deleteProduct = async (id) => {
  await db.query("DELETE FROM products WHERE id = ?", [id]);
};

//Get product by IDs (for cart)
exports.getByIds = async (ids) => {
  if (!ids || !ids.length) return [];
  const placeholders = ids.map(() => "?").join(",");
  const [rows] = await db.query(
    `SELECT * FROM products WHERE id IN (${placeholders})`,
    ids
  );
  return rows;
};
