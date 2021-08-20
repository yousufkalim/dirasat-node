// Init
const router = require("express").Router();
const { createUser } = require("../controllers/users");

// Routes

// POST
router.post("/create", createUser); //Create a User

// Export
module.exports = router;
