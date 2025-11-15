const express = require("express");
const path = require("path");
const session = require("express-session");
const fs = require("fs");
const sessionConfig = require("./middleware/sessionConfig");

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session(sessionConfig));

// Make session user available globally in EJS
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

const swaggerDocs = require("./config/swagger");
swaggerDocs(app);

// Import routes
const indexRoutes = require("./routes/index");
const shopRoutes = require("./routes/shop");
const cartRoutes = require("./routes/cart"); // Cart routes (MySQL connected)
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/admin");
const orderRoutes = require("./routes/orderRoutes");

//  Use routes
app.use("/", indexRoutes);
app.use("/shop", shopRoutes);
app.use("/cart", cartRoutes); // Cart system
app.use("/api/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/orders", orderRoutes);

// Debugging info
const routesFolder = fs.readdirSync(path.join(__dirname, "routes"));
console.log("Routes folder:", routesFolder);

//error page
app.use((req, res, next) => {
  res.render("error", {
    title: "Error",
    message: "page not found or cant be reached",
  });
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
