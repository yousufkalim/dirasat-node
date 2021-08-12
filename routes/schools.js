// Init
const router = require("express").Router();
const { getAll, postAll } = require("../controllers/schools");
const { upload } = require("../middleware/multer");

// Routes
router.get("/", getAll); //Get all schools
router.post("/", upload.single("schools"), postAll); //Post all schools

// Export
module.exports = router;
