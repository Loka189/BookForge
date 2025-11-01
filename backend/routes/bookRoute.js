const express = require('express');
const router = express.Router();
const { createBook, getBooks, getBookById, updateBook, deleteBook,updateBookCover,getPublishedBooks } = require('../controller/bookController');
const { protect } = require('../middlewares/authMiddleware');
const upload=require('../middlewares/uploadMiddleware');



// Define book routes
// Published books route (no protection needed)
router.get('/published', getPublishedBooks);
// Apply protection middleware to all book routes
router.use(protect);
router.route('/').post(createBook).get(getBooks);
router.route('/:id').get(getBookById).put(updateBook).delete(deleteBook);
router.route('/cover/:id').put(upload.single('coverImage'), updateBookCover);

module.exports = router; 