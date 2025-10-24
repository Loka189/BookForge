const express = require('express');
const router = express.Router();
const { generateChapterContent, generateBookOutline } = require('../controller/aiController');
const { protect } = require('../middlewares/authMiddleware');

// Apply protection middleware to all AI routes
router.use(protect);

// Define AI routes
router.route('/generate-outline').post(generateBookOutline);
router.route('/generate-chapter-content').post(generateChapterContent);

module.exports = router;