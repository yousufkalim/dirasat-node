// Init
const router = require("express").Router();
const { domainFile } = require("../middleware/multer");
const { postAll, getAll } = require("../controllers/domains");

// Routes
router.get("/", getAll); //Get all domains
router.post("/", domainFile.single("domains"), postAll); //Post all domains

// Export
module.exports = router;
