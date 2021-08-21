// Init
const router = require("express").Router();
const { createUser } = require("../controllers/users");
const { validateUser, isValidated } = require("../middleware/validators");

// Routes

// POST
router.post("/create", validateUser, isValidated,createUser); //Create a User

// Export
module.exports = router;
