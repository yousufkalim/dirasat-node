// Init
const router = require("express").Router();
const {
  login,
  logout,
  confirmAuth,
  signUp,
} = require("../../controllers/admin/auth");
const { checkAuth } = require("../../middleware/checkAuth");

// Routes
router.post("/login", login);
router.get("/logout", logout);
router.get("/check-auth", checkAuth, confirmAuth);
router.post("/signUp", signUp);

// Export
module.exports = router;
