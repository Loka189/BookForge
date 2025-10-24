const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed file types
const allowedTypes = /jpeg|jpg|png|gif/;

// File type check
const checkFileType = (file, cb) => {
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
    }
};

// Multer storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),

    // ✅ give meaningful name
    filename: (req, file, cb) => {
        // You can take id from req.body or req.params
        const id = req.body.bookId || req.params.id || 'unknown';
        const ext = path.extname(file.originalname);
        const safeId = String(id).replace(/[^a-zA-Z0-9_-]/g, ''); // remove unsafe chars
        cb(null, `${safeId}_${Date.now()}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
    fileFilter: (req, file, cb) => checkFileType(file, cb)
}).single('coverImage'); // form field name

module.exports = upload;
