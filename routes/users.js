// Init
const router = require("express").Router();
const { createUser } = require("../controllers/users");

// Routes
router.post("/create", createUser); //Create a User

// Export
module.exports = router;
