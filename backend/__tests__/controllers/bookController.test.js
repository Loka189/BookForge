const {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    updateBookCover
} = require('../../controller/bookController');
const Book = require('../../models/Book');
const { getCache, setCache, delCache } = require('../../services/cacheService');
const cloudinary = require('../../config/cloudinary');

// Mock dependencies
jest.mock('../../models/Book');
jest.mock('../../services/cacheService');
jest.mock('../../config/cloudinary');

describe('Book Controller Tests', () => {
    let req, res;
    
    beforeEach(() => {
        req = {
            body: {},
            params: {},
            user: { _id: 'user123' },
            file: null
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('createBook', () => {
        it('should create a new book successfully', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'user123',
                title: 'My Book',
                author: 'John Doe',
                subtitle: 'A great book',
                chapters: []
            };

            Book.create.mockResolvedValue(mockBook);
            delCache.mockResolvedValue(true);

            req.body = {
                title: 'My Book',
                author: 'John Doe',
                subtitle: 'A great book',
                chapters: []
            };

            await createBook(req, res);

            expect(Book.create).toHaveBeenCalledWith({
                userID: 'user123',
                title: 'My Book',
                author: 'John Doe',
                subtitle: 'A great book',
                chapters: []
            });
            expect(delCache).toHaveBeenCalledWith('books:user123');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockBook);
        });

        it('should return 400 if title is missing', async () => {
            req.body = {
                author: 'John Doe'
            };

            await createBook(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Title and Author are required' });
            expect(Book.create).not.toHaveBeenCalled();
        });

        it('should return 400 if author is missing', async () => {
            req.body = {
                title: 'My Book'
            };

            await createBook(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Title and Author are required' });
        });

        it('should handle database errors', async () => {
            Book.create.mockRejectedValue(new Error('Database error'));

            req.body = {
                title: 'My Book',
                author: 'John Doe'
            };

            await createBook(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error during book creation' });
        });
    });

    describe('getBooks', () => {
        it('should return books from cache if available', async () => {
            const mockBooks = [
                { _id: 'book1', title: 'Book 1', chapterCount: 5 },
                { _id: 'book2', title: 'Book 2', chapterCount: 3 }
            ];

            getCache.mockResolvedValue(mockBooks);

            await getBooks(req, res);

            expect(getCache).toHaveBeenCalledWith('books:user123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBooks);
            expect(Book.aggregate).not.toHaveBeenCalled();
        });

        it('should fetch from database and cache if cache misses', async () => {
            const mockBooks = [
                { _id: 'book1', title: 'Book 1', chapterCount: 5 },
                { _id: 'book2', title: 'Book 2', chapterCount: 3 }
            ];

            getCache.mockResolvedValue(null);
            Book.aggregate.mockResolvedValue(mockBooks);
            setCache.mockResolvedValue(true);

            await getBooks(req, res);

            expect(getCache).toHaveBeenCalledWith('books:user123');
            expect(Book.aggregate).toHaveBeenCalled();
            expect(setCache).toHaveBeenCalledWith('books:user123', mockBooks, 3600);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBooks);
        });

        it('should return 404 if no books found', async () => {
            getCache.mockResolvedValue(null);
            Book.aggregate.mockResolvedValue(null);

            await getBooks(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'No books found' });
        });

        it('should not cache if books array is empty', async () => {
            getCache.mockResolvedValue(null);
            Book.aggregate.mockResolvedValue([]);

            await getBooks(req, res);

            expect(setCache).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        it('should handle database errors', async () => {
            getCache.mockResolvedValue(null);
            Book.aggregate.mockRejectedValue(new Error('Database error'));

            await getBooks(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error during fetching books for a single user' });
        });
    });

    describe('getBookById', () => {
        it('should return book by ID successfully', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'user123',
                title: 'My Book',
                author: 'John Doe'
            };

            Book.findById.mockResolvedValue(mockBook);
            req.params.id = 'book123';

            await getBookById(req, res);

            expect(Book.findById).toHaveBeenCalledWith('book123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBook);
        });

        it('should return 404 if book not found', async () => {
            Book.findById.mockResolvedValue(null);
            req.params.id = 'book123';

            await getBookById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
        });

        it('should return 403 if user is not authorized', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'differentUser',
                title: 'My Book'
            };

            Book.findById.mockResolvedValue(mockBook);
            req.params.id = 'book123';

            await getBookById(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized to access this book' });
        });

        it('should handle database errors', async () => {
            Book.findById.mockRejectedValue(new Error('Database error'));
            req.params.id = 'book123';

            await getBookById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error during fetching book by ID' });
        });
    });

    describe('updateBook', () => {
        it('should update book successfully', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'user123',
                title: 'My Book'
            };

            const updatedBook = {
                _id: 'book123',
                userID: 'user123',
                title: 'Updated Book'
            };

            Book.findById.mockResolvedValue(mockBook);
            Book.findByIdAndUpdate.mockResolvedValue(updatedBook);

            req.params.id = 'book123';
            req.body = { title: 'Updated Book' };

            await updateBook(req, res);

            expect(Book.findByIdAndUpdate).toHaveBeenCalledWith('book123', { title: 'Updated Book' }, { new: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedBook);
        });

        it('should return 404 if book not found', async () => {
            Book.findById.mockResolvedValue(null);
            req.params.id = 'book123';

            await updateBook(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
        });

        it('should return 403 if user is not authorized', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'differentUser'
            };

            Book.findById.mockResolvedValue(mockBook);
            req.params.id = 'book123';

            await updateBook(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized to update this book' });
        });

        it('should handle database errors', async () => {
            Book.findById.mockRejectedValue(new Error('Database error'));
            req.params.id = 'book123';

            await updateBook(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error during updating book' });
        });
    });

    describe('deleteBook', () => {
        it('should delete book successfully', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'user123'
            };

            Book.findById.mockResolvedValue(mockBook);
            Book.findByIdAndDelete.mockResolvedValue(mockBook);

            req.params.id = 'book123';

            await deleteBook(req, res);

            expect(Book.findByIdAndDelete).toHaveBeenCalledWith('book123');
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book deleted' });
        });

        it('should return 404 if book not found', async () => {
            Book.findById.mockResolvedValue(null);
            req.params.id = 'book123';

            await deleteBook(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
        });

        it('should return 403 if user is not authorized', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'differentUser'
            };

            Book.findById.mockResolvedValue(mockBook);
            req.params.id = 'book123';

            await deleteBook(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized to delete this book' });
        });

        it('should handle database errors', async () => {
            Book.findById.mockRejectedValue(new Error('Database error'));
            req.params.id = 'book123';

            await deleteBook(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error during deleting book' });
        });
    });

    describe('updateBookCover', () => {
        it('should update book cover successfully', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'user123',
                coverImage: {
                    url: 'old-url.jpg',
                    public_id: 'old_public_id'
                },
                save: jest.fn().mockResolvedValue({
                    coverImage: {
                        url: 'new-url.jpg',
                        public_id: 'new_public_id'
                    }
                })
            };

            Book.findById.mockResolvedValue(mockBook);
            cloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' });

            req.params.id = 'book123';
            req.file = {
                path: 'new-url.jpg',
                filename: 'new_public_id'
            };

            await updateBookCover(req, res);

            expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('old_public_id');
            expect(mockBook.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                url: 'new-url.jpg',
                public_id: 'new_public_id'
            });
        });

        it('should return 404 if book not found', async () => {
            Book.findById.mockResolvedValue(null);
            req.params.id = 'book123';
            req.file = { path: 'new-url.jpg' };

            await updateBookCover(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
        });

        it('should return 403 if user is not authorized', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'differentUser'
            };

            Book.findById.mockResolvedValue(mockBook);
            req.params.id = 'book123';
            req.file = { path: 'new-url.jpg' };

            await updateBookCover(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized to update cover image for this book' });
        });

        it('should return 400 if no file uploaded', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'user123'
            };

            Book.findById.mockResolvedValue(mockBook);
            req.params.id = 'book123';
            req.file = null;

            await updateBookCover(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'No file uploaded' });
        });

        it('should handle cloudinary deletion errors gracefully', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'user123',
                coverImage: {
                    url: 'old-url.jpg',
                    public_id: 'old_public_id'
                },
                save: jest.fn().mockResolvedValue({
                    coverImage: {
                        url: 'new-url.jpg',
                        public_id: 'new_public_id'
                    }
                })
            };

            Book.findById.mockResolvedValue(mockBook);
            cloudinary.uploader.destroy.mockRejectedValue(new Error('Cloudinary error'));

            req.params.id = 'book123';
            req.file = {
                path: 'new-url.jpg',
                filename: 'new_public_id'
            };

            await updateBookCover(req, res);

            // Should still update the book despite cloudinary error
            expect(mockBook.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should handle database errors', async () => {
            Book.findById.mockRejectedValue(new Error('Database error'));
            req.params.id = 'book123';
            req.file = { path: 'new-url.jpg' };

            await updateBookCover(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error during cover image update' });
        });
    });
});