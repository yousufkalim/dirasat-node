// Init
const router = require("express").Router();
const {
  getAll,
  update
} = require("../controllers/siteViews");

// Routes
router.get("/", getAll);
router.post("/", update);

// Export
module.exports = router;
