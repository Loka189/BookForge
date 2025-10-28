const Book = require('../models/Book');
const { getCache, setCache,delCache } = require('../services/cacheService');
// @desc  Create new book
// @route POST /api/books
// @access Private
exports.createBook = async (req, res) => {
    try {
        const { title, author, subtitle, chapters } = req.body;
        if (!title || !author) {
            return res.status(400).json({ message: 'Title and Author are required' });
        }
        const book = await Book.create({
            userID: req.user._id,
            title,
            author,
            subtitle,
            chapters
        });
        const cacheKey = `books:${req.user._id.toString()}`;
        // Invalidate cache for this user
        await delCache(cacheKey);
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc  Get all books for the logged in user
// @route GET /api/books
// @access Private
exports.getBooks = async (req, res) => {
  try {
    const userID = req.user._id.toString();

    // 1️⃣ Try Redis cache first
    const cacheKey = `books:${userID}`;
    const cachedBooks = await getCache(cacheKey);

    if (cachedBooks) {
      console.log("📦 Serving from Redis cache");
      return res.status(200).json(cachedBooks);
    }

    // 2️⃣ Cache miss → fetch from MongoDB
    console.log("💾 Cache miss → fetching from MongoDB");
    const books = await Book.find({ userID }).sort({ createdAt: -1 }); 

    if (!books) {
      return res.status(404).json({ message: "No books found" });
    }

    // 3️⃣ Cache result for 1 hour (3600 seconds)
    if (books.length > 0) {
      await setCache(cacheKey, books, 3600);
    }

    return res.status(200).json(books);
  } catch (error) {
    console.error("getBooks error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// @desc  Get a single book by ID
// @route GET /api/books/:id
// @access Private
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.userID.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to access this book' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc  Update a book by ID
// @route PUT /api/books/:id
// @access Private
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.userID.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this book' });
        }
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc  Delete a book by ID
// @route DELETE /api/books/:id
// @access Private
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.userID.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this book' });
        }
        await Book.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Update a book's cover image
// @route PUT /api/books/cover/:id
// @access Private
const fs = require('fs');

const path = require('path');

exports.updateBookCover = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.userID.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update cover image for this book' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Delete old cover image if it exists
        if (book.coverImage) {
            const oldPath = path.join(__dirname, '..', book.coverImage);
            fs.access(oldPath, fs.constants.F_OK, (err) => {
                if (!err) {
                    fs.unlink(oldPath, (err) => {
                        if (err) console.error('Failed to delete old cover image:', err);
                        else console.log('Old cover image deleted');
                    });
                }
            });
        }

        // Update book with new cover image
        book.coverImage = `/uploads/${req.file.filename}`;
        const updatedBook = await book.save();

        return res.status(200).json(updatedBook);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
