// Init
const router = require("express").Router();
const {
  getResults,
  getOneResult,
  getUserResult,
  deleteResult,
} = require("../../controllers/admin/results");

// Routes

// GET
router.get("/get-results", getResults); //Fetching results from database for Admin
router.get("/single-result/:_id", getOneResult); //Get A Result By Id
router.get("/user-results/:_id", getUserResult); //Get A Result By User Id

// DELETE
router.delete("/result", deleteResult); //Delete A User

// Export
module.exports = router;
