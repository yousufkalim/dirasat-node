// Init
const router = require("express").Router();
const { upload } = require("../middleware/multer");
const { getAll, postAll } = require("../controllers/jobs");

// Routes
router.get("/", getAll); //Get all jobs
router.post("/", upload.single("jobs"), postAll); //Post all jobs

// Export
module.exports = router;
