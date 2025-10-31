const express = require('express');
const router = express.Router();
const { createBook, getBooks, getBookById, updateBook, deleteBook,updateBookCover,getPublishedBooks } = require('../controller/bookController');
const { protect } = require('../middlewares/authMiddleware');
const upload=require('../middlewares/uploadMiddleware');
const rateLimiter=require('../middlewares/rateLimiter');

// Define book routes

// public route to get published books
router.get('/published', rateLimiter({ windowSize: 60, maxRequests: 10 }), getPublishedBooks);

// protected routes for user's books
router.use(protect);
router.use(rateLimiter({ windowSize: 60, maxRequests: 15 }));
router.get('/', getBooks);
router.post('/', createBook);

router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

router.put('/cover/:id', upload, updateBookCover);


module.exports = router; 