module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverageFrom: [
        'controller/**/*.js',
        'middlewares/**/*.js',
        'models/**/*.js',
        'services/**/*.js',
        '!**/node_modules/**'
    ],
    coverageDirectory: 'coverage',
    setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
    
    // ✅ Show detailed test names
    verbose: true,
    
    testTimeout: 10000,
    forceExit: true,
    detectOpenHandles: false
};