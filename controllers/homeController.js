const Product = require("../models/productModel");

exports.getHome = async (req, res) => {
  try {
    const products = await Product.getFeatured();
    res.render("index", {
      title: "Home | Furni",
      user: req.session.user || null,
      products,
    });
  } catch (err) {
    console.error("Error loading homepage:", err);
    res.status(500).send("Error loading homepage.");
  }
};
