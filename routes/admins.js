// Init
const router = require("express").Router();
const { create } = require("../controllers/admins.js");

// Routes
router.post("/create", create); // For Development Purposes

// Export
module.exports = router;
