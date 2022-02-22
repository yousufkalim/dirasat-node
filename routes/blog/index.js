/**
 * All api routes handles here
 * @author Yousuf Kalim
 */
const router = require("express").Router();

// Parent Routes
// admin
router.use("/admins", require("./admins"));
router.use("/blogs", require("./blogs"));

// Export
module.exports = router;
