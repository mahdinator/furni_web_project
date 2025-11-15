const express = require("express");
const router = express.Router();

const Product = require("../models/productModel");
const User = require("../models/userModel");
const Log = require("../models/adminLogModel");
const orderController = require("../controllers/orderController");

const { ensureAuthenticated } = require("../middleware/authMiddleware");
const { ensureAdmin } = require("../middleware/adminMiddleware");

// =============================================================
// 🟩 ADMIN DASHBOARD
// =============================================================
router.get("/dashboard", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const products = await Product.getAll();
    const users = await User.getAllUsers();

    res.render("adminDashboard", {
      title: "Admin Panel",
      products,
      users,
      user: req.session.user,
    });
  } catch (err) {
    console.error("❌ Error loading admin dashboard:", err);
    res.status(500).render("error", { message: "Error loading admin panel." });
  }
});

// =============================================================
// 🟩 VIEW ACTIVITY LOGS
// =============================================================
router.get("/logs", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const logs = await Log.getAllLogs();

    res.render("adminLogs", {
      title: "Admin Activity Logs",
      logs,
      user: req.session.user,
    });
  } catch (err) {
    console.error("❌ Error loading logs:", err);
    res.status(500).render("error", { message: "Error loading logs." });
  }
});

// =============================================================
// 🟩 ADD PRODUCT
// =============================================================
router.post("/products", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    await Product.addProduct(req.body);

    await Log.logAction(req.session.user.id, "Added Product", `Product: ${req.body.name}`);

    res.json({ success: true, message: "✅ Product added successfully!" });
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ success: false, message: "Error adding product." });
  }
});

// =============================================================
// 🟩 UPDATE PRODUCT
// =============================================================
router.put("/products/:id", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    await Product.updateProduct(req.params.id, req.body);

    await Log.logAction(req.session.user.id, "Updated Product", `Product ID: ${req.params.id}`);

    res.json({ success: true, message: "✅ Product updated successfully!" });
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ success: false, message: "Error updating product." });
  }
});

// =============================================================
// 🟩 DELETE PRODUCT
// =============================================================
router.delete("/products/:id", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    await Product.deleteProduct(req.params.id);

    await Log.logAction(req.session.user.id, "Deleted Product", `Product ID: ${req.params.id}`);

    res.json({ success: true, message: "🗑 Product deleted!" });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ success: false, message: "Error deleting product." });
  }
});

// =============================================================
// 🟩 USER ROLE
// =============================================================
router.put("/users/:id/role", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const target = await User.findUserById(id);
    if (!target) return res.status(404).json({ success: false, message: "User not found." });

    const adminCount = await User.countAdmins();

    if (target.role === "admin" && role === "user" && adminCount <= 1) {
      return res.status(400).json({ success: false, message: "❌ Cannot demote last admin!" });
    }

    await User.updateUserRole(id, role);

    await Log.logAction(req.session.user.id, "Updated User Role", `User ID: ${id}, New Role: ${role}`);

    res.json({ success: true, message: "✅ Role updated!" });

  } catch (err) {
    console.error("❌ Error updating user role:", err);
    res.status(500).json({ success: false, message: "Error updating role." });
  }
});

// =============================================================
// 🟩 SUSPEND USER
// =============================================================
router.put("/users/:id/suspend", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const user = await User.findUserById(req.params.id);

    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const adminCount = await User.countAdmins();
    if (user.role === "admin" && adminCount <= 1) {
      return res.status(400).json({ success: false, message: "❌ Cannot suspend last admin!" });
    }

    await User.updateSuspendedStatus(req.params.id, 1);

    await Log.logAction(req.session.user.id, "Suspended User", `User ID: ${req.params.id}`);

    res.json({ success: true, message: "⛔ User suspended!" });

  } catch (err) {
    console.error("❌ Error suspending user:", err);
    res.status(500).json({ success: false, message: "Error suspending user." });
  }
});

// =============================================================
// 🟩 UNSUSPEND USER
// =============================================================
router.put("/users/:id/unsuspend", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    await User.updateSuspendedStatus(req.params.id, 0);

    await Log.logAction(req.session.user.id, "Unsuspended User", `User ID: ${req.params.id}`);

    res.json({ success: true, message: "✅ User unsuspended!" });
  } catch (err) {
    console.error("❌ Error unsuspending user:", err);
    res.status(500).json({ success: false, message: "Error unsuspending user." });
  }
});

// =============================================================
// 🟩 VIEW USER PURCHASE HISTORY
// =============================================================
router.get("/users/:id/purchases", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const purchases = await User.getUserPurchases(req.params.id);

    await Log.logAction(req.session.user.id, "Viewed Purchases", `User ID: ${req.params.id}`);

    res.json({ success: true, purchases });
  } catch (err) {
    console.error("❌ Error fetching purchases:", err);
    res.status(500).json({ success: false, message: "Error fetching purchases." });
  }
});

// =============================================================
// 🟩 RESET PASSWORD
// =============================================================
router.put("/users/:id/reset-password", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const newPassword = req.body.newPassword;

    if (!newPassword)
      return res.status(400).json({ success: false, message: "Missing new password" });

    await User.resetPassword(req.params.id, newPassword);

    await Log.logAction(req.session.user.id, "Reset Password", `User ID: ${req.params.id}`);

    res.json({ success: true, message: "Password reset successfully!" });

  } catch (err) {
    console.error("❌ Error resetting password:", err);
    res.status(500).json({ success: false, message: "Error resetting password." });
  }
});

// =============================================================
// 🟩 DELETE USER
// =============================================================
router.delete("/users/:id", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const adminCount = await User.countAdmins();

    if (user.role === "admin" && adminCount <= 1) {
      return res.status(400).json({ success: false, message: "❌ Cannot delete last admin!" });
    }

    const purchases = await User.getUserPurchases(id);
    if (purchases.length > 0) {
      return res.status(400).json({ success: false, message: "❌ Cannot delete a user with orders!" });
    }

    await User.deleteUser(id);

    await Log.logAction(req.session.user.id, "Deleted User", `User ID: ${id}`);

    res.json({ success: true, message: "🗑 User deleted!" });

  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ success: false, message: "Error deleting user." });
  }
});

// =============================================================
// 🟩 ADMIN: ALL ORDERS
// =============================================================
router.get("/orders", ensureAuthenticated, ensureAdmin, orderController.adminGetAllOrders);

// =============================================================
// 🟩 ADMIN: ORDER DETAILS
// =============================================================
router.get("/orders/:id", ensureAuthenticated, ensureAdmin, orderController.adminGetOrderDetails);

module.exports = router;
