const jwt = require("jsonwebtoken");

// Check auth
exports.checkAuth = (req, res, next) => {
  // Get token from Header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No  token authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "jwt");
    req.user = decoded.user;

    // If user authenticated
    res.set(
      "cache-control",
      "no-cache, no-store, private, must-revalidate, post-check=0, pre-check=0"
    );

    next();
  } catch (err) {
    // If not
    res.status(401).send("Your session is expired");
  }
};
