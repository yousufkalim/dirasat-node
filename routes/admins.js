// Init
const router = require("express").Router();
const {
  create,
  getResults,
  getOneResult,
  getUserResult,
  deleteResult,
} = require("../controllers/admins.js");
const { checkAuth } = require("../middleware/checkAuth");

// Routes

// GET
router.get("/get-results", checkAuth, getResults); //Fetching results from database for Admin
router.get("/single-result/:_id", checkAuth, getOneResult); //Get A Result By Id
router.get("/user-results/:_id", checkAuth, getUserResult); //Get A Result By User Id

// POST
router.post("/create", create); // For Development Purposes

// DELETE
router.delete("/result", deleteResult); //Delete A User

// Export
module.exports = router;
