// Init
const router = require("express").Router();

// All Routes
router.use("/example", require("./example"));
router.use("/domains", require("./domains"));
router.use("/questions", require("./questions"));
router.use("/answers", require("./answers"));
router.use("/jobs", require("./jobs"));

// Export
module.exports = router;
