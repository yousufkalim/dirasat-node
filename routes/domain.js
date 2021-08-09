// Init
const router = require("express").Router();
const multer = require("multer");
const { postAll } = require("../controllers/domain");

// Multer Declaration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post("/all", upload.single("domains"), postAll);

// Export
module.exports = router;
