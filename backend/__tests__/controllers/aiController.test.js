// Create the mock BEFORE requiring the controller
let mockGenerateContent;

jest.mock('@google/genai', () => {
    mockGenerateContent = jest.fn();
    
    return {
        GoogleGenAI: jest.fn().mockImplementation(() => ({
            models: {
                generateContent: mockGenerateContent
            }
        }))
    };
});

const { generateBookOutline, generateChapterContent } = require('../../controller/aiController');

describe('AI Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            user: { _id: 'user123' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('generateBookOutline', () => {
        it('should generate book outline successfully', async () => {
            const mockOutline = [
                { title: 'Chapter 1: Introduction', description: 'This is the intro.' },
                { title: 'Chapter 2: Core Concepts', description: 'Core concepts explained.' }
            ];

            const mockResponse = {
                text: `Here is your outline: ${JSON.stringify(mockOutline)}`
            };

            mockGenerateContent.mockResolvedValue(mockResponse);

            req.body = {
                topic: 'JavaScript Programming',
                style: 'Technical',
                numberOfChapters: 2,
                description: 'A comprehensive guide'
            };

            await generateBookOutline(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ outline: mockOutline });
            expect(mockGenerateContent).toHaveBeenCalled();
        });

        it('should return 400 if topic is missing', async () => {
            req.body = {
                style: 'Technical',
                numberOfChapters: 5
            };

            await generateBookOutline(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Topic is required' });
            expect(mockGenerateContent).not.toHaveBeenCalled();
        });

        it('should return 500 if AI response has no JSON array', async () => {
            const mockResponse = {
                text: 'This is just text without JSON array'
            };

            mockGenerateContent.mockResolvedValue(mockResponse);

            req.body = {
                topic: 'JavaScript Programming',
                style: 'Technical',
                numberOfChapters: 5
            };

            await generateBookOutline(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Failed to parse AI response' });
        });

        it('should return 500 if JSON parsing fails', async () => {
            const mockResponse = {
                text: '[{invalid json}]'
            };

            mockGenerateContent.mockResolvedValue(mockResponse);

            req.body = {
                topic: 'JavaScript Programming',
                style: 'Technical',
                numberOfChapters: 5
            };

            await generateBookOutline(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Failed to generate book outline' });
        });

        it('should handle AI service errors', async () => {
            mockGenerateContent.mockRejectedValue(new Error('AI service down'));

            req.body = {
                topic: 'JavaScript Programming',
                style: 'Technical',
                numberOfChapters: 5
            };

            await generateBookOutline(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error during AI outline generation' });
        });

        it('should use default numberOfChapters if not provided', async () => {
            const mockOutline = [
                { title: 'Chapter 1', description: 'Description 1' }
            ];

            const mockResponse = {
                text: JSON.stringify(mockOutline)
            };

            mockGenerateContent.mockResolvedValue(mockResponse);

            req.body = {
                topic: 'JavaScript Programming',
                style: 'Technical'
            };

            await generateBookOutline(req, res);

            expect(mockGenerateContent).toHaveBeenCalled();
            const callArgs = mockGenerateContent.mock.calls[0][0];
            expect(callArgs.contents).toContain('Number of Chapters: 5');
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('generateChapterContent', () => {
        it('should generate chapter content successfully', async () => {
            const mockContent = 'This is the chapter content with detailed explanations...';

            const mockResponse = {
                text: mockContent
            };

            mockGenerateContent.mockResolvedValue(mockResponse);

            req.body = {
                chapterTitle: 'Introduction to JavaScript',
                chapterDescription: 'Basic concepts of JavaScript',
                writingStyle: 'Technical'
            };

            await generateChapterContent(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ content: mockContent });
            expect(mockGenerateContent).toHaveBeenCalled();
        });

        it('should return 400 if chapterTitle is missing', async () => {
            req.body = {
                chapterDescription: 'Some description',
                writingStyle: 'Technical'
            };

            await generateChapterContent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Chapter title is required' });
            expect(mockGenerateContent).not.toHaveBeenCalled();
        });

        it('should work without chapterDescription', async () => {
            const mockContent = 'Chapter content here...';

            const mockResponse = {
                text: mockContent
            };

            mockGenerateContent.mockResolvedValue(mockResponse);

            req.body = {
                chapterTitle: 'Introduction to JavaScript',
                writingStyle: 'Technical'
            };

            await generateChapterContent(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ content: mockContent });
        });

        it('should handle AI service errors', async () => {
            mockGenerateContent.mockRejectedValue(new Error('AI service error'));

            req.body = {
                chapterTitle: 'Introduction to JavaScript',
                writingStyle: 'Technical'
            };

            await generateChapterContent(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error during AI chapter generation' });
        });

        it('should include writing style in the prompt', async () => {
            const mockResponse = { text: 'Content' };
            mockGenerateContent.mockResolvedValue(mockResponse);

            req.body = {
                chapterTitle: 'Advanced Topics',
                writingStyle: 'Academic'
            };

            await generateChapterContent(req, res);

            expect(mockGenerateContent).toHaveBeenCalled();
            const callArgs = mockGenerateContent.mock.calls[0][0];
            expect(callArgs.contents).toContain('Academic');
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});