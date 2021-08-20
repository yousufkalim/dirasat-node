// Init
const router = require("express").Router();
const { checkAuth } = require("../../middleware/checkAuth");

// All Routes
router.use("/auth", require("./auth"));
router.use("/admin", checkAuth, require("./admins"));
router.use("/results", checkAuth, require("./results"));
router.use("/users", checkAuth, require("./users"));

// Export
module.exports = router;
