// Init
const router = require("express").Router();
const {
  login,
  logout,
  confirmAuth,
  tokenlogin,
  signUp,
  getdata,
} = require("../../controllers/admin/auth");
const { checkAuth } = require("../../middleware/checkAuth");
const auth = require("../../middleware/auth");

// Routes
router.post("/login", login);
router.get("/logout", logout);
router.get("/check-auth", checkAuth, confirmAuth);
// router.post("/tokenlogin", tokenlogin);
router.post("/signUp", signUp);
router.get("/getdata", auth, getdata);
// Export
module.exports = router;
