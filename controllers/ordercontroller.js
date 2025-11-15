const {
  getUserOrders,
  getUserOrderById,
  getOrderItems,
  getAllOrders,
  getAdminOrderById,
  getUserPurchases,
} = require("../models/orderModel");

// ============================================================
// USER: VIEW ALL ORDERS
// ============================================================
exports.getOrders = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const orders = await getUserOrders(userId);

    res.render("orders", {
      title: "My Orders",
      orders,
    });
  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
    res.status(500).send("Error loading orders");
  }
};

// ============================================================
// USER: VIEW ORDER DETAILS
// ============================================================
exports.getOrderDetails = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const orderId = req.params.id;

    const order = await getUserOrderById(orderId, userId);
    if (!order) return res.status(403).send("Access denied to this order.");

    const items = await getOrderItems(orderId);

    res.render("orderDetails", {
      title: `Order #${orderId}`,
      order,
      items,
    });
  } catch (err) {
    console.error("❌ Error fetching order details:", err);
    res.status(500).send("Error loading order details");
  }
};

// ============================================================
// ADMIN: VIEW ALL ORDERS
// ============================================================
exports.adminGetAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();

    res.render("adminOrders", {
      title: "All Orders",
      orders,
    });
  } catch (err) {
    console.error("❌ Error loading admin orders:", err);
    res.status(500).send("Error loading admin orders");
  }
};

// ============================================================
// ADMIN: VIEW ORDER DETAILS
// ============================================================
exports.adminGetOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await getAdminOrderById(orderId);

    if (!order) return res.status(404).send("Order not found.");

    const items = await getOrderItems(orderId);

    res.render("adminOrderDetails", {
      title: `Order #${orderId}`,
      order,
      items,
    });
  } catch (err) {
    console.error("❌ Error fetching admin order details:", err);
    res.status(500).send("Error loading admin order details");
  }
};

// ============================================================
// USED BY ADMIN DELETE USER
// ============================================================
exports.getUserPurchases = async (userId) => {
  return await getUserPurchases(userId);
};
