const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    content: {
        type: String,
        default: '',
    },
},);
const BookSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        default: '',
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    coverImage: {
        url: { type: String, default: '' },
        public_id: { type: String, default: '' },
    },
    chapters: [chapterSchema],
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
}, { timestamps: true });

BookSchema.index({ userID: 1, createdAt: -1 });


module.exports = mongoose.model('Book', BookSchema);