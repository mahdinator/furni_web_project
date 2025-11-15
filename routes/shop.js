const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");

router.get("/", shopController.getShop);
router.post("/add-to-cart/:id", shopController.addToCart);

module.exports = router;
/**
 * @openapi
 * tags:
 *   - name: Shop
 *     description: Public shop browsing and product actions
 *
 * paths:
 *
 *   /shop:
 *     get:
 *       summary: View the shop homepage with product listings
 *       tags: [Shop]
 *       responses:
 *         200:
 *           description: Shop page rendered
 *
 *   /shop/add-to-cart/{id}:
 *     post:
 *       summary: Add a product to the cart (guest or user)
 *       tags: [Shop]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: Product ID to add to cart
 *       requestBody:
 *         required: false
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 quantity:
 *                   type: integer
 *                   default: 1
 *       responses:
 *         200:
 *           description: Product added to cart
 *         400:
 *           description: Invalid product ID or request
 *         404:
 *           description: Product not found
 */
