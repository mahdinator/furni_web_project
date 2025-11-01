const express = require("express");
const router = express.Router();
const db = require("../db");

// Home page – show featured products
router.get("/", async (req, res) => {
  try {
    const [products] = await db.query(
      "SELECT * FROM products WHERE is_featured = TRUE AND quantity > 0 ORDER BY created_at DESC"
    );

    for (p in products) {
      console.log(p.name);
    }

    res.render("index", {
      title: "Home | Furni",
      products,
    });
  } catch (err) {
    console.error("Error loading featured products:", err);
    res.status(500).send("Error loading homepage.");
  }
});

module.exports = router;
