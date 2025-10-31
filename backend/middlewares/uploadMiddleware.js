const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// ✅ Setup Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bookforge/uploads', // your Cloudinary folder
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    public_id: (req, file) => {
      const id = req.body.bookId || req.params.id || 'unknown';
      const safeId = String(id).replace(/[^a-zA-Z0-9_-]/g, '');
      return `${safeId}_${Date.now()}`; // example: book123_1730359333
    },
  },
});

// ✅ Multer setup using Cloudinary storage
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
});

module.exports = upload;
