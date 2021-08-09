// Init
const router = require("express").Router();
const { upload } = require("../middleware/multer");
const { postAll, getAll } = require("../controllers/domains");

// Routes
router.get("/", getAll); //Get all domains
router.post("/", upload.single("domains"), postAll); //Post all domains

// Export
module.exports = router;
