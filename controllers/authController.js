// controllers/authController.js

const bcrypt = require("bcrypt");
const { registerUser, findUserByEmail } = require("../models/userModel");

// SHOW LOGIN PAGE
function showLogin(req, res) {
  res.render("login", { error: null, message: null });
}

// SHOW REGISTER PAGE
function showRegister(req, res) {
  res.render("register", { error: null, message: null });
}

// REGISTER USER
async function register(req, res) {
  const { username, email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).render("register", {
        error: "This email is already registered.",
        message: null,
      });
    }

    await registerUser(username, email, password);

    return res.render("login", {
      message: "Registration successful! Please log in.",
      error: null,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.render("register", {
      error: "Server error. Please try again later.",
      message: null,
    });
  }
}

// LOGIN USER
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.render("login", {
        error: "No user found with this email.",
        message: null,
      });
    }

    if (user.suspended === 1) {
      return res.render("login", {
        error: "Your account has been suspended.",
        message: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("login", {
        error: "Incorrect password.",
        message: null,
      });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      suspended: user.suspended,
    };

    return res.redirect("/");
  } catch (err) {
    console.error("Login error:", err);
    return res.render("login", {
      error: "Server error. Please try again later.",
      message: null,
    });
  }
}

// LOGOUT
function logout(req, res) {
  if (!req.session) return res.redirect("/");

  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).render("error", {
        message: "Logout failed.",
      });
    }

    res.clearCookie("connect.sid");
    res.redirect("/");
  });
}

module.exports = {
  showLogin,
  showRegister,
  register,
  login,
  logout,
};
