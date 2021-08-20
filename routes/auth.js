// Init
const router = require("express").Router();
const { login, logout, confirmAuth } = require("../controllers/auth");
// const checkAuth = require("../middleware/checkAuth");

// Routes
router.post("/login", login);
router.get("/logout", logout);
router.get("/check-auth", confirmAuth);

// Export
module.exports = router;
