// Init
const router = require("express").Router();
const { login, logout } = require("../controllers/auth");

// Routes
router.post("/login", login);
router.get("/logout", logout);

// Export
module.exports = router;
