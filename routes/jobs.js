// Init
const router = require("express").Router();
const { upload } = require("../middleware/multer");
const { getAll } = require("../controllers/jobs");

// Routes
router.get("/", getAll); //Get all domains

// Export
module.exports = router;
