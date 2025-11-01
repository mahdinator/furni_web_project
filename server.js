const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(
  session({
    secret: "furni-secret-key", // use any string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // keep false for local HTTP; set true on HTTPS
  })
);

// Routes
const indexRoutes = require("./routes/index");
const shopRoutes = require("./routes/shop");
const cartRoutes = require("./routes/cart");

app.use("/", indexRoutes);
app.use("/shop", shopRoutes);
app.use("/cart", cartRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
