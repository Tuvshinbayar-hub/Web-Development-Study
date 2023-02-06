const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser('jojo123'));

app.get('/setCookie', (req, res) => {
    res.cookie('foo1', 'foo2');
    res.send('cookie has been set');
})

app.get('/setsignedcookie', (req, res) => {
    res.cookie('signedFoo1', 'singed foo Value', { signed: true });
    res.send('signed cookie has been set');
})

app.get('/getsignedcookie', (req, res) => {
    console.log(req.signedCookies);
    console.log(req.cookies);

    res.send(req.signedCookies);
})

app.listen('3000', () => {
    console.log('Listening to 3000');
})