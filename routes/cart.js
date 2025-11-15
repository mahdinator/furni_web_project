const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

//  View cart
router.get("/", ensureAuthenticated, cartController.getCart);

//  Add to cart
router.post("/add", ensureAuthenticated, cartController.addToCart);

// Update quantity
router.put("/update/:id", ensureAuthenticated, cartController.updateCart);

//  Remove item
router.post("/remove/:id", ensureAuthenticated, cartController.removeFromCart);

//  FIRST: Show checkout page
router.get("/checkout", ensureAuthenticated, cartController.checkoutPage);

//  SECOND: Process checkout
router.post("/checkout", ensureAuthenticated, cartController.processCheckout);

//  Success page
router.get("/success", ensureAuthenticated, (req, res) => {
  res.render("orderSuccess", { title: "Order Successful" });
});

module.exports = router;

/**
 * @openapi
 * tags:
 *   - name: Cart
 *     description: Shopping cart operations
 *
 * paths:
 *   /cart:
 *     get:
 *       summary: Get the current user's cart
 *       tags: [Cart]
 *       security:
 *         - sessionAuth: []
 *       responses:
 *         200:
 *           description: Cart page rendered
 *
 *   /cart/add:
 *     post:
 *       summary: Add an item to the cart
 *       tags: [Cart]
 *       security:
 *         - sessionAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               required:
 *                 - product_id
 *               properties:
 *                 product_id:
 *                   type: integer
 *                 quantity:
 *                   type: integer
 *       responses:
 *         200:
 *           description: Item added to cart
 *
 *   /cart/update/{id}:
 *     put:
 *       summary: Update item quantity
 *       tags: [Cart]
 *       security:
 *         - sessionAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: Product ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - quantity
 *               properties:
 *                 quantity:
 *                   type: integer
 *       responses:
 *         200:
 *           description: Quantity updated
 *         404:
 *           description: Item not found
 *
 *   /cart/remove/{id}:
 *     post:
 *       summary: Remove an item from the cart
 *       tags: [Cart]
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
 *           description: Item removed
 *         404:
 *           description: Item not found
 *
 *   /cart/checkout:
 *     get:
 *       summary: Display checkout page
 *       tags: [Cart]
 *       security:
 *         - sessionAuth: []
 *       responses:
 *         200:
 *           description: Checkout page rendered
 *
 *     post:
 *       summary: Process checkout and create an order
 *       tags: [Cart]
 *       security:
 *         - sessionAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               required:
 *                 - payment_method
 *               properties:
 *                 payment_method:
 *                   type: string
 *       responses:
 *         302:
 *           description: Redirect to success page
 *
 *   /cart/success:
 *     get:
 *       summary: Display order success page
 *       tags: [Cart]
 *       security:
 *         - sessionAuth: []
 *       responses:
 *         200:
 *           description: Order success page rendered
 */
