const {
  getCartItems,
  findCartItem,
  addCartItem,
  incrementCartItem,
  updateCartItem,
  removeCartItem,
  getCheckoutItems,
  clearCart,
} = require("../models/cartModel");

const { createOrder, addOrderItem } = require("../models/orderModel");

const db = require("../config/db");

// ==========================================
// GET CART PAGE
// ==========================================
exports.getCart = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.redirect("/api/auth/login");

    const cart = await getCartItems(userId);

    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );

    res.render("cart", {
      title: "Your Cart",
      cart,
      subtotal,
    });
  } catch (err) {
    console.error("Error loading cart:", err);
    res.status(500).send("Error loading cart");
  }
};

// ==========================================
// ADD TO CART
// ==========================================
exports.addToCart = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { product_id, quantity = 1 } = req.body;

    if (!userId) return res.json({ success: false, message: "Login required" });

    const existing = await findCartItem(userId, product_id);

    if (existing) {
      await incrementCartItem(userId, product_id, quantity);
    } else {
      await addCartItem(userId, product_id, quantity);
    }

    res.json({ success: true, message: "Item added to cart" });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

// ==========================================
// UPDATE QUANTITY
// ==========================================
exports.updateCart = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const productId = req.params.id;
    const { quantity } = req.body;

    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Login required" });

    if (!productId || !quantity || quantity < 1)
      return res.status(400).json({ success: false, message: "Invalid data" });

    const [result] = await updateCartItem(userId, productId, quantity);

    if (result.affectedRows > 0) {
      return res.json({ success: true });
    }

    res.status(404).json({ success: false, message: "Item not found" });
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==========================================
// REMOVE ITEM
// ==========================================
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const productId = req.params.id;

    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Login required" });

    const [result] = await removeCartItem(userId, productId);

    if (result.affectedRows > 0) {
      return res.json({ success: true });
    }

    res.status(404).json({ success: false, message: "Item not found" });
  } catch (err) {
    console.error("Error removing cart item:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==========================================
// CHECKOUT PAGE
// ==========================================
exports.checkoutPage = async (req, res) => {
  try {
    const userId = req.session.user?.id;

    const cartItems = await getCheckoutItems(userId);

    if (cartItems.length === 0) return res.redirect("/cart");

    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    res.render("checkout", {
      title: "Checkout",
      cartItems,
      total,
    });
  } catch (err) {
    console.error("Checkout page error:", err);
    res.status(500).send("Error loading checkout page");
  }
};

// ==========================================
// PROCESS CHECKOUT
exports.processCheckout = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const paymentMethod = req.body.payment_method;

    if (!paymentMethod) {
      return res.status(400).send("Payment method missing");
    }

    const cartItems = await getCheckoutItems(userId);
    if (cartItems.length === 0) return res.redirect("/cart");

    const total = cartItems.reduce(
      (sum, item) => sum + item.quantity * Number(item.price),
      0
    );

    // 1. Create order
    const orderId = await createOrder(userId, total, paymentMethod);

    // 2. Insert order items
    for (const item of cartItems) {
      await addOrderItem(
        orderId,
        item.product_id,
        item.quantity,
        Number(item.price)
      );
    }

    // 3. Clear cart
    await clearCart(userId);

    res.redirect("/cart/success");
  } catch (err) {
    console.error("Checkout processing error:", err);
    res.status(500).send("Error completing checkout");
  }
};
