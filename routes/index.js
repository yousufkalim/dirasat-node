// Init
const router = require("express").Router();

// All Routes
router.use("/example", require("./example"));
router.use("/domain", require("./domain"));

// Export
module.exports = router;
