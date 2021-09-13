// Init
const router = require("express").Router();

// All Routes
router.use("/example", require("./example"));
router.use("/domains", require("./domains"));
router.use("/questions", require("./questions"));
router.use("/answers", require("./answers"));
router.use("/courses", require("./courses"));
router.use("/results", require("./results"));
router.use("/institute", require("./schools"));
router.use("/users", require("./users"));
router.use("/jobs", require("./jobs"));
router.use("/admin", require("./admin"));

// Export
module.exports = router;
