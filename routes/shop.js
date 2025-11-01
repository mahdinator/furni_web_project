const express = require("express");
const router = express.Router();
const db = require("../db");
const { fuzzyFilter } = require("../fuzzysearch");

// /shop route
router.get("/", async (req, res) => {
  // try {
  //   const [products] = await db.query("SELECT * FROM products");
  //   res.render("shop", { title: "Shop | Furni", products });
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).send("Database error");
  // }

  const { query, category, min, max } = req.query;
  // Basic example
  let sql = "SELECT * FROM products WHERE price BETWEEN ? AND ?";
  const values = [min || 1, max || 5000];

  if (category) {
    sql += " AND category = ?";
    values.push(category);
  }

  const [products] = await db.execute(sql, values);
  filtered = fuzzyFilter(products, query);
  res.render("shop", {
    title: "Shop | Furni",
    products: filtered,
    query,
    category,
    min,
    max,
  });
});

//add product to shoping cart
// Add to cart (from + icon)
router.post("/add-to-cart/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (!Array.isArray(req.session.cart)) {
    req.session.cart = [];
  }

  // Prevent duplicates if you want (optional)
  if (!req.session.cart.includes(id)) {
    req.session.cart.push(id);
  }

  res.json({ success: true, count: req.session.cart.length });
});

module.exports = router;
