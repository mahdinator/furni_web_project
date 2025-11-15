const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

//  Homepage
router.get("/", homeController.getHome);

module.exports = router;
/**
 * @openapi
 * tags:
 *   - name: Home
 *     description: Public homepage
 *
 * paths:
 *   /:
 *     get:
 *       summary: Render the homepage
 *       tags: [Home]
 *       responses:
 *         200:
 *           description: Homepage rendered successfully
 */
