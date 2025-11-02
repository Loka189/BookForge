const {
    registerUser, loginUser, getUserProfile, updateProfile
} = require('../../controller/authController');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../models/User');
jest.mock('jsonwebtoken');

describe('Auth Controller Tests', () => {
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
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            const mockUser = {
                _id: 'user123',
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashedPassword'
            };

            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('fake-jwt-token');

            req.body = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            };

            await registerUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
            expect(User.create).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User registered successfully',
                token: 'fake-jwt-token'
            });
        });

        it('should return 400 if required fields are missing', async () => {
            req.body = {
                name: 'John Doe',
                email: 'john@example.com'
                // password missing
            };

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Please provide all required fields' });
            expect(User.create).not.toHaveBeenCalled();
        });

        it('should return 400 if user already exists', async () => {
            User.findOne.mockResolvedValue({ email: 'john@example.com' });

            req.body = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            };

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
            expect(User.create).not.toHaveBeenCalled();
        });

        it('should return 400 if user creation fails', async () => {
            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue(null);

            req.body = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            };

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid user data' });
        });

        it('should handle database errors', async () => {
            User.findOne.mockRejectedValue(new Error('Database error'));

            req.body = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            };

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });

    describe('loginUser', () => {
        it('should login user successfully with valid credentials', async () => {
            const mockUser = {
                _id: 'user123',
                name: 'John Doe',
                email: 'john@example.com',
                matchPassword: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });
            jwt.sign.mockReturnValue('fake-jwt-token');

            req.body = {
                email: 'john@example.com',
                password: 'password123'
            };

            await loginUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
            expect(mockUser.matchPassword).toHaveBeenCalledWith('password123');
            expect(res.json).toHaveBeenCalledWith({
                _id: 'user123',
                name: 'John Doe',
                email: 'john@example.com',
                message: 'Login successful',
                token: 'fake-jwt-token'
            });
        });

        it('should return 401 for invalid email', async () => {
            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            req.body = {
                email: 'wrong@example.com',
                password: 'password123'
            };

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
        });

        it('should return 401 for invalid password', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'john@example.com',
                matchPassword: jest.fn().mockResolvedValue(false)
            };

            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            req.body = {
                email: 'john@example.com',
                password: 'wrongpassword'
            };

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
        });

        it('should handle database errors', async () => {
            User.findOne.mockReturnValue({
                select: jest.fn().mockRejectedValue(new Error('Database error'))
            });

            req.body = {
                email: 'john@example.com',
                password: 'password123'
            };

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });

    describe('getUserProfile', () => {
        it('should return user profile successfully', async () => {
            const mockUser = {
                _id: 'user123',
                name: 'John Doe',
                email: 'john@example.com',
                avatar: 'https://example.com/avatar.jpg',
                isPro: false
            };

            User.findById.mockResolvedValue(mockUser);

            await getUserProfile(req, res);

            expect(User.findById).toHaveBeenCalledWith('user123');
            expect(res.json).toHaveBeenCalledWith({
                _id: 'user123',
                name: 'John Doe',
                email: 'john@example.com',
                avatar: 'https://example.com/avatar.jpg',
                isPro: false
            });
        });

        it('should return 404 if user not found', async () => {
            User.findById.mockResolvedValue(null);

            await getUserProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should handle database errors', async () => {
            User.findById.mockRejectedValue(new Error('Database error'));

            await getUserProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });

    describe('updateProfile', () => {
        it('should update user profile successfully', async () => {
            const mockUser = {
                _id: 'user123',
                name: 'John Doe',
                avatar: 'old-avatar.jpg',
                save: jest.fn().mockResolvedValue(true)
            };

            User.findById.mockResolvedValue(mockUser);

            req.body = {
                name: 'John Updated',
                avatar: 'new-avatar.jpg'
            };

            await updateProfile(req, res);

            expect(mockUser.name).toBe('John Updated');
            expect(mockUser.avatar).toBe('new-avatar.jpg');
            expect(mockUser.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                _id: 'user123',
                name: 'John Updated',
                avatar: 'new-avatar.jpg'
            });
        });

        it('should only update provided fields', async () => {
            const mockUser = {
                _id: 'user123',
                name: 'John Doe',
                avatar: 'old-avatar.jpg',
                save: jest.fn().mockResolvedValue(true)
            };

            User.findById.mockResolvedValue(mockUser);

            req.body = {
                name: 'John Updated'
                // avatar not provided
            };

            await updateProfile(req, res);

            expect(mockUser.name).toBe('John Updated');
            expect(mockUser.avatar).toBe('old-avatar.jpg');
        });

        it('should return 404 if user not found', async () => {
            User.findById.mockResolvedValue(null);

            req.body = {
                name: 'John Updated'
            };

            await updateProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should handle database errors', async () => {
            User.findById.mockRejectedValue(new Error('Database error'));

            req.body = {
                name: 'John Updated'
            };

            await updateProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });
});