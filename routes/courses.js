// Init
const router = require("express").Router();
const { upload } = require("../middleware/multer");
const { postAll, getAll } = require("../controllers/courses");

// Routes
router.get("/", getAll); //Get all courses
router.post("/", upload.single("courses"), postAll); //Post all courses

// Export
module.exports = router;
