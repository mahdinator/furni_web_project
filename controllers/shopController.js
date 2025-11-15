const db = require("../config/db");
const Product = require("../models/productModel");
const { fuzzyFilter } = require("../fuzzysearch");

// SHOP PAGE — with defaults and fuzzy search
exports.getShop = async (req, res) => {
  try {
    // Use safe defaults and clean parameters
    const query = req.query.query || "";
    const category = req.query.category || "";
    const min = parseFloat(req.query.min) || 1;
    const max = parseFloat(req.query.max) || 9999;

    // Fetch products from DB
    const products = await Product.getFiltered({ category, min, max });

    // Optional fuzzy text filtering
    const filtered = query ? fuzzyFilter(products, query) : products;

    // Render the shop page
    res.render("shop", {
      title: "Shop | Furni",
      products: filtered,
      query,
      category,
      min,
      max,
    });
  } catch (err) {
    console.error("❌ Error loading shop:", err);
    res.status(500).render("error", {
      title: "Error | Furni",
      message: "Error loading shop. Please try again later.",
    });
  }
};

// ADD TO CART — uses session safely
exports.addToCart = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (!req.session.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please log in first." });
    }

    if (!Array.isArray(req.session.cart)) req.session.cart = [];

    if (!req.session.cart.includes(id)) {
      req.session.cart.push(id);
    }

    res.json({ success: true, count: req.session.cart.length });
  } catch (err) {
    console.error("❌ Error adding to cart:", err);
    res.status(500).json({ message: "Error adding product to cart." });
  }
};
