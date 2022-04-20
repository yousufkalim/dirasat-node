// Init
const router = require("express").Router();
const { getAll, postAll } = require("../controllers/wilaya");

// Routes
router.get("/", getAll); //Get all Wilaya
router.post("/", postAll); //Post all Wilaya

// Export
module.exports = router;
