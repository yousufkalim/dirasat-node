// Init
const router = require("express").Router();
const { domainFile } = require("../middleware/multer");
const { postAll } = require("../controllers/domains");

// Routes
router.post("/", domainFile.single("domains"), postAll); //Post all domains

// Export
module.exports = router;
