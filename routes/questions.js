// Init
const router = require("express").Router();
const { getAll, postAll } = require("../controllers/questions");
const { upload } = require("../middleware/multer");

// Routes
router.get("/", getAll); //Get all domains
router.post("/", upload.single("questions"), postAll); //Post all questions

// Export
module.exports = router;
