// Init
const router = require("express").Router();

// All Routes
router.use("/example", require("./example"));
router.use("/domains", require("./domains"));
router.use("/questions", require("./questions"));

// Export
module.exports = router;
