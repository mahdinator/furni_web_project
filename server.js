const express = require("express");
const path = require("path");
const session = require("express-session");
const sessionConfig = require("./middleware/sessionConfig");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session(sessionConfig));

const indexRoutes = require("./routes/index");
const shopRoutes = require("./routes/shop");
const cartRoutes = require("./routes/cart");

app.use("/", indexRoutes);
app.use("/shop", shopRoutes);
app.use("/cart", cartRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
