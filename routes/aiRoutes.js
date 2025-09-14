const express = require("express");
const router = express.Router();
const { generateRules } = require("../controller/aiController");
const { isLoggedIn } = require("../middleware/isLoggedIn");

// @desc    Convert natural language to segmentation rules
// @route   POST /api/ai/text-to-rules
// @access  Private
router.post("/text-to-rules", isLoggedIn, generateRules);

module.exports = router;