const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const bcrypt = require('bcryptjs');
const logger = require('../logger/logger');
const jwt = require('../middleware/jwt');

router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', jwt.checkToken, async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        pages: req.body.pages,
        genre: req.body.genre,
        published: req.body.published,
        userId: req.body.userId
    });
    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', jwt.checkToken, async (req, res) => {
    const { id } = req.params;
    try {
        await Book.findByIdAndRemove(id);
        res.json({ message: 'Deleted Book' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', jwt.checkToken, async (req, res) => {
    const { id } = req.params;
    const updatedBook = {
        title: req.body.title,
        author: req.body.author,
        pages: req.body.pages,
        genre: req.body.genre,
        published: req.body.published,
        userId: req.body.userId
    };
    try {
        const book = await Book.findByIdAndUpdate(id, updatedBook, { new: true });
        res.json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
