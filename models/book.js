const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    pages: Number,
    genre: { type: String },
    published: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;