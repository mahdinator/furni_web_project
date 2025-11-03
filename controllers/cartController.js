const Product = require("../models/productModel");

exports.getCart = async (req, res) => {
  try {
    const cartIds = Array.isArray(req.session.cart) ? req.session.cart : [];

    //if cart empty render empty
    if (!cartIds.length)
      return res.render("cart", { title: "Your Cart", cart: [], subtotal: 0 });

    //call db to get cart
    const rows = await Product.getByIds(cartIds);
    const cart = rows.map((p) => ({
      ...p,
      price: Number(p.price),
      quantity: 1,
    }));
    const subtotal = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

    res.render("cart", { title: "Your Cart", cart, subtotal, total: subtotal });
  } catch (err) {
    console.error("Error loading cart:", err);
    res.status(500).send("Error loading cart");
  }
};

exports.removeFromCart = (req, res) => {
  const id = parseInt(req.params.id);
  if (Array.isArray(req.session.cart))
    req.session.cart = req.session.cart.filter((pid) => pid !== id);
  res.json({ success: true });
};
