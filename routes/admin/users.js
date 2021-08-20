// Init
const router = require("express").Router();
const {
  getOneUser,
  getAllUsers,
  deleteUser,
} = require("../../controllers/admin/users");

// Routes

// GET
router.get("/all-users", getAllUsers); //Get All User
router.get("/single-user/:_id", getOneUser); //Get A User

// DELETE
router.delete("/:_id", deleteUser); //Delete A User

// Export
module.exports = router;
