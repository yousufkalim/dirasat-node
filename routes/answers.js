// Init
const router = require("express").Router();
const { upload } = require("../middleware/multer");
const { postAll, getAll } = require("../controllers/answers");

// Routes
router.get("/", getAll); //Get all domains
router.post("/", upload.single("answers"), postAll); //Post all answers

// Export
module.exports = router;
