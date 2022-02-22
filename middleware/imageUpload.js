const multer = require("multer");
const path = require("path");

const imageStorage = multer.diskStorage({
  destination: `uploads`, // Destination to store images
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10000000, // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    // upload only mp4 and mkv format
    if (!file.originalname.match(/\.(jpeg|png|svg|jpg|gif)$/)) {
      return cb(new Error("Please upload Image"));
    }
    cb(undefined, true);
  },
});

const blogImageStorage = multer.diskStorage({
  destination: `uploads/blogImages`, // Destination to store images
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const blogImageUpload = multer({
  storage: blogImageStorage,
  limits: {
    fileSize: 10000000, // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    // upload only mp4 and mkv format
    if (!file.originalname.match(/\.(jpeg|png|svg|jpg|gif)$/)) {
      return cb(new Error("Please upload Image"));
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload, blogImageUpload };
