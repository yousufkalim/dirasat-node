const multer = require("multer");

// Multer Declaration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
// Domain Multer declaration
const domainFile = multer({ storage });

module.exports = { domainFile };
