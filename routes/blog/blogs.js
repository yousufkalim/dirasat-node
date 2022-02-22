// Init
const router = require("express").Router();
const { blogImageUpload } = require("../../middleware/imageUpload");
const { checkAdminAuth } = require("../../middleware/adminAuth");
const {
  getAllBlogs,
  getOneBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../../controllers/blog/blogs");
const {
  validateBlog,
  isValidated,
} = require("../../middleware/validators/blogs");

// Routes
router.post(
  "/",
  checkAdminAuth,
  blogImageUpload.single("blog_images"),
  validateBlog,
  isValidated,
  createBlog
);
router.get("/", getAllBlogs);
router.get("/:id", getOneBlog);
router.put("/:id", blogImageUpload.single("blog_images"), updateBlog);
router.delete("/:id", deleteBlog);

// Export
module.exports = router;
