// Init
const router = require("express").Router();
const { create, getResults } = require("../controllers/admins.js");
const { checkAuth } = require("../middleware/checkAuth.js");

// Routes
router.post("/create", create); // For Development Purposes
router.get("/get-results", checkAuth, getResults); //Fetching results from database for Admin

// Export
module.exports = router;
