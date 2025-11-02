const { exportAsDocument, exportAsPDF } = require('../../controller/exportController');
const Book = require('../../models/Book');
const { Document, Packer } = require('docx');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Mock dependencies
jest.mock('../../models/Book');
jest.mock('docx');
jest.mock('pdfkit');
jest.mock('fs');

describe('Export Controller Tests', () => {
    let req, res, mockStream;

    beforeEach(() => {
        req = {
            params: { id: 'book123' },
            user: { _id: 'user123' }
        };
        
        mockStream = {
            pipe: jest.fn(),
            on: jest.fn(),
            end: jest.fn()
        };
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            setHeader: jest.fn(),
            send: jest.fn(),
            headersSent: false
        };
        
        jest.clearAllMocks();
    });

    describe('exportAsDocument', () => {
        it('should export book as DOCX successfully', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'user123',
                title: 'My Book',
                author: 'John Doe',
                subtitle: 'A Great Book',
                chapters: [
                    {
                        title: 'Chapter 1',
                        content: '# Introduction\n\nThis is the introduction.'
                    }
                ],
                coverImage: null
            };

            const mockBuffer = Buffer.from('mock-docx-content');

            Book.findById.mockResolvedValue(mockBook);
            
            // Mock Document constructor
            Document.mockImplementation(() => ({}));
            
            // Mock Packer.toBuffer
            Packer.toBuffer.mockResolvedValue(mockBuffer);

            await exportAsDocument(req, res);

            expect(Book.findById).toHaveBeenCalledWith('book123');
            expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=My_Book.docx');
            expect(res.send).toHaveBeenCalledWith(mockBuffer);
        });

        it('should return 404 if book not found', async () => {
            Book.findById.mockResolvedValue(null);

            await exportAsDocument(req, res);

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

            await exportAsDocument(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized to access this book' });
        });

        it('should handle books with cover images', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'user123',
                title: 'My Book',
                author: 'John Doe',
                subtitle: '',
                chapters: [],
                coverImage: '/uploads/cover.jpg'
            };

            const mockBuffer = Buffer.from('mock-docx-content');
            const mockImageBuffer = Buffer.from('image-data');

            Book.findById.mockResolvedValue(mockBook);
            fs.existsSync.mockReturnValue(true);
            fs.promises = {
                readFile: jest.fn().mockResolvedValue(mockImageBuffer)
            };
            Document.mockImplementation(() => ({}));
            Packer.toBuffer.mockResolvedValue(mockBuffer);

            await exportAsDocument(req, res);

            expect(fs.promises.readFile).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(mockBuffer);
        });

        it('should handle errors during export', async () => {
            Book.findById.mockRejectedValue(new Error('Database error'));

            await exportAsDocument(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error during document export' });
        });

        it('should process markdown content correctly', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'user123',
                title: 'My Book',
                author: 'John Doe',
                subtitle: '',
                chapters: [
                    {
                        title: 'Chapter 1',
                        content: '# Heading\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2'
                    }
                ],
                coverImage: null
            };

            const mockBuffer = Buffer.from('mock-docx-content');

            Book.findById.mockResolvedValue(mockBook);
            Document.mockImplementation(() => ({}));
            Packer.toBuffer.mockResolvedValue(mockBuffer);

            await exportAsDocument(req, res);

            expect(Document).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(mockBuffer);
        });
    });

    describe('exportAsPDF', () => {
        it('should export book as PDF successfully', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'user123',
                title: 'My Book',
                author: 'John Doe',
                subtitle: 'A Great Book',
                chapters: [
                    {
                        title: 'Chapter 1',
                        content: '# Introduction\n\nThis is the introduction.'
                    }
                ],
                coverImage: null
            };

            const mockPdfDoc = {
                pipe: jest.fn(),
                font: jest.fn().mockReturnThis(),
                fontSize: jest.fn().mockReturnThis(),
                fillColor: jest.fn().mockReturnThis(),
                text: jest.fn().mockReturnThis(),
                moveDown: jest.fn().mockReturnThis(),
                addPage: jest.fn().mockReturnThis(),
                end: jest.fn(),
                page: {
                    width: 612,
                    height: 792,
                    margins: { top: 72, bottom: 72, left: 72, right: 72 }
                },
                y: 100
            };

            Book.findById.mockResolvedValue(mockBook);
            PDFDocument.mockImplementation(() => mockPdfDoc);

            await exportAsPDF(req, res);

            expect(Book.findById).toHaveBeenCalledWith('book123');
            expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
            expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=My_Book.pdf');
            expect(mockPdfDoc.pipe).toHaveBeenCalledWith(res);
            expect(mockPdfDoc.end).toHaveBeenCalled();
        });

        it('should return 404 if book not found', async () => {
            Book.findById.mockResolvedValue(null);

            await exportAsPDF(req, res);

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

            await exportAsPDF(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized to access this book' });
        });

        it('should handle books with cover images', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'user123',
                title: 'My Book',
                author: 'John Doe',
                subtitle: '',
                chapters: [],
                coverImage: '/uploads/cover.jpg'
            };

            const mockPdfDoc = {
                pipe: jest.fn(),
                font: jest.fn().mockReturnThis(),
                fontSize: jest.fn().mockReturnThis(),
                fillColor: jest.fn().mockReturnThis(),
                text: jest.fn().mockReturnThis(),
                moveDown: jest.fn().mockReturnThis(),
                addPage: jest.fn().mockReturnThis(),
                image: jest.fn().mockReturnThis(),
                end: jest.fn(),
                page: {
                    width: 612,
                    height: 792,
                    margins: { top: 72, bottom: 72, left: 72, right: 72 }
                },
                y: 100
            };

            Book.findById.mockResolvedValue(mockBook);
            PDFDocument.mockImplementation(() => mockPdfDoc);
            fs.existsSync.mockReturnValue(true);

            await exportAsPDF(req, res);

            expect(mockPdfDoc.image).toHaveBeenCalled();
            expect(mockPdfDoc.end).toHaveBeenCalled();
        });

        it('should handle errors during PDF export', async () => {
            Book.findById.mockRejectedValue(new Error('Database error'));

            await exportAsPDF(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error during PDF export' });
        });

        it('should process multiple chapters', async () => {
            const mockBook = {
                _id: 'book123',
                userID: 'user123',
                title: 'My Book',
                author: 'John Doe',
                subtitle: '',
                chapters: [
                    { title: 'Chapter 1', content: 'Content 1' },
                    { title: 'Chapter 2', content: 'Content 2' },
                    { title: 'Chapter 3', content: 'Content 3' }
                ],
                coverImage: null
            };

            const mockPdfDoc = {
                pipe: jest.fn(),
                font: jest.fn().mockReturnThis(),
                fontSize: jest.fn().mockReturnThis(),
                fillColor: jest.fn().mockReturnThis(),
                text: jest.fn().mockReturnThis(),
                moveDown: jest.fn().mockReturnThis(),
                addPage: jest.fn().mockReturnThis(),
                end: jest.fn(),
                page: {
                    width: 612,
                    height: 792,
                    margins: { top: 72, bottom: 72, left: 72, right: 72 }
                },
                y: 100
            };

            Book.findById.mockResolvedValue(mockBook);
            PDFDocument.mockImplementation(() => mockPdfDoc);

            await exportAsPDF(req, res);

            expect(mockPdfDoc.addPage).toHaveBeenCalledTimes(3); // One for each chapter
            expect(mockPdfDoc.end).toHaveBeenCalled();
        });
    });
});