// Init
const router = require("express").Router();
const { upload } = require("../middleware/multer");
const {
  postAll,
  postAllDcourse,
  getAll,
  updatePostalCode
} = require("../controllers/courses");

// Routes
router.get("/", getAll); //Get all courses
router.post("/", upload.single("courses"), postAll); //Post all courses
router.post("/dcourse", upload.single("courses"), postAllDcourse); //Post all courses
router.post("/update", updatePostalCode); //Post all courses

// Export
module.exports = router;
