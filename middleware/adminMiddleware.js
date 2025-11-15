function ensureAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    return next();
  } else {
    return res.status(403).render("error", {
      title: "Access Denied",
      message: "🚫 Access denied. Admins only.",
    });
  }
}

module.exports = { ensureAdmin };
