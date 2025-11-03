module.exports = {
  // Used to sign the session ID cookie to prevent tampering
  secret: "furni-secret-key",

  // Do not force the session to be saved back to the session store
  // if it wasn't modified during the request
  resave: false,

  // Save new sessions even if they are empty (no data yet)
  // If you set this to false, sessions won't be stored until something is added
  saveUninitialized: true,

  // Settings for the cookie that stores the session ID on the client
  cookie: {
    // For local development, keep secure: false (HTTP)
    // In production with HTTPS, set secure: true to enforce HTTPS-only cookies
    secure: false,
  },
};
