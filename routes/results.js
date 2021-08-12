// Init
const router = require("express").Router();
const { create } = require("../controllers/results");

// Routes
router.post("/", create); //Post result

// Export
module.exports = router;
