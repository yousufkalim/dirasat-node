// Init
const router = require("express").Router();
const { login, logout, confirmAuth } = require("../../controllers/admin/auth");
const { checkAuth } = require("../../middleware/checkAuth");

// Routes
router.post("/login", login);
router.get("/logout", logout);
router.get("/check-auth", checkAuth, confirmAuth);

// Export
module.exports = router;
