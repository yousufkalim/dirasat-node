// Init
const router = require("express").Router();
const {
  createUser,
  getOneUser,
  getAllUsers,
  deleteUser,
} = require("../controllers/users");
const { checkAuth } = require("../middleware/checkAuth");

// Routes

// GET
router.get("/all-users", getAllUsers); //Get All User
router.get("/single-user/:_id", getOneUser); //Get A User

// POST
router.post("/create", createUser); //Create a User

// DELETE
router.delete("/:_id", checkAuth, deleteUser); //Delete A User

// Export
module.exports = router;
