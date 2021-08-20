// Init
const router = require("express").Router();
const { create } = require("../../controllers/admin/admins.js");

// Routes

// POST
router.post("/create", create); // For Development Purposes

// Export
module.exports = router;
