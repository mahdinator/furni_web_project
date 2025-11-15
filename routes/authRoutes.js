// routes/authRoutes.js

const express = require("express");
const router = express.Router();

const {
  showLogin,
  showRegister,
  register,
  login,
  logout,
} = require("../controllers/authController");

const {
  validateRegister,
  validateLogin,
} = require("../middleware/authValidation");

router.get("/login", showLogin);
router.get("/register", showRegister);

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

router.post("/logout", logout);

module.exports = router;

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: User authentication and session management
 *
 * paths:
 *   /auth/login:
 *     get:
 *       summary: Render the login page
 *       tags: [Auth]
 *       responses:
 *         200:
 *           description: Login page rendered
 *
 *     post:
 *       summary: Authenticate user and start a session
 *       tags: [Auth]
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - password
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         200:
 *           description: Login successful
 *         400:
 *           description: Invalid input or authentication failure
 *
 *   /auth/register:
 *     get:
 *       summary: Render the registration page
 *       tags: [Auth]
 *       responses:
 *         200:
 *           description: Registration page rendered
 *
 *     post:
 *       summary: Create a new user
 *       tags: [Auth]
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               required:
 *                 - username
 *                 - email
 *                 - password
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         200:
 *           description: User registered successfully
 *         400:
 *           description: Validation error or email already exists
 *
 *   /auth/logout:
 *     post:
 *       summary: Log out the user and destroy the session
 *       tags: [Auth]
 *       responses:
 *         200:
 *           description: User logged out
 */
