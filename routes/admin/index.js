// Init
const router = require("express").Router();
const { checkAuth } = require("../../middleware/checkAuth");
const auth = require("../../middleware/auth");

// All Routes
router.use("/auth", require("./auth"));
router.use("/admin", auth, require("./admins"));
router.use("/results", auth, require("./results"));
router.use("/users", auth, require("./users"));

// Export
module.exports = router;
