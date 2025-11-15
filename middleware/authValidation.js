// middleware/authValidation.js

function sanitize(input) {
  return input ? input.trim() : "";
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

// REGISTER VALIDATION
function validateRegister(req, res, next) {
  let { username, email, password } = req.body;

  username = sanitize(username);
  email = sanitize(email);
  password = sanitize(password);

  req.body.username = username;
  req.body.email = email;
  req.body.password = password;

  if (!username || !email || !password) {
    return res.render("register", {
      error: "All fields are required.",
      message: null,
    });
  }

  if (!validateEmail(email)) {
    return res.render("register", {
      error: "Invalid email format.",
      message: null,
    });
  }

  if (!validatePassword(password)) {
    return res.render("register", {
      error: "Password must be at least 6 characters long.",
      message: null,
    });
  }

  next();
}

// LOGIN VALIDATION
function validateLogin(req, res, next) {
  let { email, password } = req.body;

  email = sanitize(email);
  password = sanitize(password);

  req.body.email = email;
  req.body.password = password;

  if (!email || !password) {
    return res.render("login", {
      error: "Email and password are required.",
      message: null,
    });
  }

  if (!validateEmail(email)) {
    return res.render("login", {
      error: "Invalid email format.",
      message: null,
    });
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
};
