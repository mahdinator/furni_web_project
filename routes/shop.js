const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");

router.get("/", shopController.getShop);
router.post("/add-to-cart/:id", shopController.addToCart);

module.exports = router;
