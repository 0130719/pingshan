'use strict'

const express = require('express');

const app = express();

app.get('/ppp', (req, res) => {
    res.json({
        a: 'a',
        1: 1
    });
});

app.listen(9625, () => {
    console.log('Server started.');
});