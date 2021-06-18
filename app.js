const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');

const app = express();

app.use(express.json({ extended: true }));
app.use('/api/auth', require('./routes/auth.router'));
app.use('/api/link', require('./routes/link.router'));
app.use('/t', require('./routes/redirect.router'));

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = config.get('port') || 5000;
async function start() {
    try {
        await mongoose.connect(config.get('mongoUrl'), {useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true});
        app.listen(PORT, () => {
            console.log('Server has been started on:' + PORT);
        });
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
}

start();