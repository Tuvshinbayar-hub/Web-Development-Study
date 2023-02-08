const express = require('express');
const session = require('express-session');
const sessionPreferences = { secret: 'jojo123', resave: false, saveUninitialized: false };

const app = express();

app.use(session(sessionPreferences));

app.get('/viewCount', (req, res) => {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }

    res.send(`You've visited the site ${req.session.count} times`);
});

app.get('/register', (req, res) => {
    const { username = 'Jojo' } = req.query;
    req.session.username = username;
    res.redirect('./greet');
})

app.get('/greet', (req, res) => {
    const { username } = req.session;
    res.send(`Welcome back ${username}`);
})

app.listen(3000, () => {
    console.log('Listening to 3000 port');
})