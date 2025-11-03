const express = require('express');
const router = express.Router();
const { createBook, getBooks, getBookById, updateBook, deleteBook,updateBookCover,getPublishedBooks,publishBook } = require('../controller/bookController');
const { protect } = require('../middlewares/authMiddleware');
const upload=require('../middlewares/uploadMiddleware');



// @Define book routes
// public routes
router.get('/published', getPublishedBooks);


// private routes
router.use(protect);
router.get('/', getBooks);
router.post('/', createBook);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);
router.put('/cover/:id', upload.single('coverImage'), updateBookCover);
router.put('/publish/:id', publishBook);
module.exports = router; 