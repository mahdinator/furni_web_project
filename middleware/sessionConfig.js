module.exports = {
  // Used to sign the session ID cookie to prevent tampering
  secret: "furni-secret-key",

  // Do not force the session to be saved back to the session store
  // if it wasn't modified during the request
  resave: false,

  // Do NOT save sessions until user actually logs in
  saveUninitialized: false,

  // Settings for the cookie that stores the session ID on the client
  cookie: {
    httpOnly: true, // JS cannot read cookies (protects against XSS)
    secure: false, // set to true ONLY in production with HTTPS
    sameSite: "lax", // protects against CSRF
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
};
