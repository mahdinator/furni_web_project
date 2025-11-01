const express = require("express");
const router = express.Router();
const db = require("../db");

// Show cart
router.get("/", async (req, res) => {
  try {
    // Ensure the session cart exists
    const cartIds = Array.isArray(req.session.cart) ? req.session.cart : [];

    if (cartIds.length === 0) {
      return res.render("cart", {
        title: "Your Cart",
        cart: [],
        subtotal: 0,
      });
    }

    // Build the dynamic SQL placeholders (?, ?, ?)
    const placeholders = cartIds.map(() => "?").join(",");
    const sql = `SELECT * FROM products WHERE id IN (${placeholders})`;
    const [rows] = await db.query(sql, cartIds);

    // Each row becomes a cart item (quantity defaults to 1)
    const cart = rows.map((p) => ({
      ...p,
      price: Number(p.price),
      quantity: 1,
    }));

    const subtotal = cart.reduce(
      (sum, p) => sum + Number(p.price) * p.quantity,
      0
    );

    res.render("cart", { title: "Your Cart", cart, subtotal, total: subtotal });
  } catch (err) {
    console.error("Error loading cart:", err);
    res.status(500).send("Error loading cart");
  }
});

// Remove from cart
router.post("/remove/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (Array.isArray(req.session.cart)) {
    req.session.cart = req.session.cart.filter((pid) => pid !== id);
  }
  res.status(200).json({ success: true });
});
module.exports = router;
