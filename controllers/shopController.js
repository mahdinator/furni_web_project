const Product = require("../models/productModel");
const { fuzzyFilter } = require("../fuzzysearch");

exports.getShop = async (req, res) => {
  const { query, category, min, max } = req.query;
  try {
    const products = await Product.getFiltered({ category, min, max });
    const filtered = fuzzyFilter(products, query);

    res.render("shop", {
      title: "Shop | Furni",
      products: filtered,
      query,
      category,
      min,
      max,
    });
  } catch (err) {
    console.error("Error loading shop:", err);
    res.status(500).send("Error loading shop");
  }
};

exports.addToCart = (req, res) => {
  const id = parseInt(req.params.id);
  if (!Array.isArray(req.session.cart)) req.session.cart = [];
  if (!req.session.cart.includes(id)) req.session.cart.push(id);
  res.json({ success: true, count: req.session.cart.length });
};
