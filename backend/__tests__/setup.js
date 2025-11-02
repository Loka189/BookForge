// Mock Redis client to prevent actual connections during tests
jest.mock('../config/redisClient', () => ({
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    on: jest.fn(),
    quit: jest.fn().mockResolvedValue(undefined),
    isOpen: false,
    isReady: false
}));

// Suppress all console output in tests
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
    console.error.mockRestore();
    console.log.mockRestore();
    console.warn.mockRestore();
});