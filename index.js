require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');
const logger = require('./logger/logger');



const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
    logger.log('info', `${req.method} ${req.path} ${req.ip}`);
    next();
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB Connected...');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB: ' + err.message);
    });

    mongoose.connection.on('connected', () => {
        logger.log('info', `Connection to MongoDB Established`);
    });

app.get('/', (req, res) => {
    res.status(200).send('Bienvenue sur l\' API de la Librairie Machette');
});

app.use('/users', userRoutes);
app.use('/books', bookRoutes);


app.use((err, req, res, next) => {
    logger.log('error', err);

    if(process.env.NODE_ENV === 'production')
        res.status(500).json({ message: 'Something broke!' });
    else {
        res.status(500).json({
            message: err.message,
            stack: err.stack
        });
    }
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
