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

router.get('/:id', getBook, (req, res) => {
    res.json(res.book);
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

router.delete('/:id', jwt.checkToken, getBook, async (req, res) => {
    try {
        await res.book.remove();
        res.json({ message: 'Deleted Book' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getBook(req, res, next) {
    let book;
    try {
        book = await Book.findById(req.params.id);
        if (book == null) {
            return res.status(404).json({ message: 'Cannot find book' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.book = book;
    next();
}

module.exports = router;
