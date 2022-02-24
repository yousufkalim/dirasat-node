// Init
const router = require("express").Router();
const { checkAuth } = require("../../middleware/checkAuth");
const { checkAdminAuth } = require("../../middleware/adminAuth");

// All Routes
router.use("/auth", require("./auth"));
router.use("/admin", checkAuth, require("./admins"));
router.use("/results", require("./results"));
router.use("/users", require("./users"));

// Export
module.exports = router;
