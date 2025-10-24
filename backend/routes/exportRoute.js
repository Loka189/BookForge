const express = require('express');
const router = express.Router();
const { exportAsDocument, exportAsPDF }=require('../controller/exportController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/:id/document', protect, exportAsDocument);
router.get('/:id/pdf', protect, exportAsPDF);

module.exports = router;