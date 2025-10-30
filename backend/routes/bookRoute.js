const express = require('express');
const router = express.Router();
const { createBook, getBooks, getBookById, updateBook, deleteBook,updateBookCover,getPublishedBooks } = require('../controller/bookController');
const { protect } = require('../middlewares/authMiddleware');
const upload=require('../middlewares/uploadMiddleware');


// Define book routes

// public route to get published books
router.get('/published', getPublishedBooks);

// protected routes for user's books
router.get('/', protect, getBooks);
router.post('/', protect, createBook);

router.get('/:id', protect, getBookById);
router.put('/:id', protect, updateBook);
router.delete('/:id', protect, deleteBook);

router.put('/cover/:id', protect, upload, updateBookCover);


module.exports = router; 