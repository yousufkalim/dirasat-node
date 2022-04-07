// Init
const router = require("express").Router();
// const { blogImageUpload } = require("../../middleware/imageUpload");
const { checkAdminAuth } = require("../../middleware/adminAuth");
const {
  getAllVideos,
//   getOneBlog,
  addVideo,
//   updateBlog,
//   deleteBlog,
} = require("../../controllers/blog/blogs");


// Routes
router.post(
  "/",
  checkAdminAuth,
  
  addVideo
);
router.get("/", getAllVideos);
// router.get("/:id", getOneBlog);
// router.put("/:id", blogImageUpload.single("blog_images"), updateBlog);
// router.delete("/:id", deleteBlog);

// Export
module.exports = router;
