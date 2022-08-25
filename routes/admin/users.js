// Init
const router = require('express').Router();
const {
  getOneUser,
  getAllUsers,
  getAllUsersData,
  deleteUser,
  getAllUsersDataWithResult,
  getSingleUsersDataWithResult
} = require('../../controllers/admin/users');

// Routes

// GET
router.get('/all-users', getAllUsers); //Get All User
router.get('/single-user/:_id', getOneUser); //Get A User

router.get('/getallusers', getAllUsersData); //Get All Users Data
router.get('/getalluserswithresult', getAllUsersDataWithResult); //Get All Users Data with result
router.get('/getsingleuserswithresult/:id', getSingleUsersDataWithResult); //Get All Users Data with result

// DELETE
router.delete('/:_id', deleteUser); //Delete A User

// Export
module.exports = router;
