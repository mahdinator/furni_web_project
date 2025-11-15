const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const { ensureAdmin } = require("../middleware/adminMiddleware");

// ============================================
// ⚠️ ADMIN ROUTES MUST BE DEFINED FIRST!
// ============================================

// 🧾 Admin: View all orders from all users
router.get(
  "/admin/all",
  ensureAuthenticated,
  ensureAdmin,
  orderController.adminGetAllOrders
);

// 📄 Admin: View details for a specific order
router.get(
  "/admin/view/:id",
  ensureAuthenticated,
  ensureAdmin,
  orderController.adminGetOrderDetails
);

// ============================================
// USER ROUTES (Placed AFTER admin routes)
// ============================================

// 🧾 User: View my orders
router.get("/", ensureAuthenticated, orderController.getOrders);

// 📄 User: View order details
router.get("/:id", ensureAuthenticated, orderController.getOrderDetails);

module.exports = router;

/**
 * @openapi
 * tags:
 *   - name: Orders
 *     description: User and admin order management
 *
 * paths:
 *
 *   /orders/admin/all:
 *     get:
 *       summary: Admin — View all orders from all users
 *       tags: [Orders]
 *       security:
 *         - sessionAuth: []
 *       responses:
 *         200:
 *           description: List of all orders
 *         403:
 *           description: Forbidden — admin only
 *
 *   /orders/admin/view/{id}:
 *     get:
 *       summary: Admin — View details for a specific order
 *       tags: [Orders]
 *       security:
 *         - sessionAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *       responses:
 *         200:
 *           description: Order details returned
 *         404:
 *           description: Order not found
 *         403:
 *           description: Forbidden — admin only
 *
 *   /orders:
 *     get:
 *       summary: User — View my orders
 *       tags: [Orders]
 *       security:
 *         - sessionAuth: []
 *       responses:
 *         200:
 *           description: User orders returned
 *
 *   /orders/{id}:
 *     get:
 *       summary: User — View details of one order
 *       tags: [Orders]
 *       security:
 *         - sessionAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *       responses:
 *         200:
 *           description: Order details returned
 *         403:
 *           description: Access denied (order not owned by user)
 *         404:
 *           description: Order not found
 */
