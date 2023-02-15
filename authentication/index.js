const express = require('express');
const exphbs = require('express-handlebars');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./models/user');
const app = express();

app.engine(
    "handlebars",
    exphbs.engine({
        helpers: {
            eq: function (a, b) {
                return a === b;
            },
        },
    })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", false);

const sessionConfig = {
    secret: 'Mojijojo123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 3600 * 24 * 7,
        maxAge: 1000 * 3600 * 24 * 7
    }
};
app.use(session(sessionConfig));

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('./login');
    }
    next();
}

main().catch(e => console.log(e));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/authDemo");

    app.get('/', (req, res) => {
        res.send('home page!');
    })

    app.get('/register', (req, res) => {
        res.render('./register');
    })

    app.post('/register', async (req, res) => {
        const { username, password } = req.body;
        const user = new User({ username, password })

        await user.save();
        res.redirect('/');
    })
    app.get('/login', (req, res) => {
        res.render('./login');
    })

    app.post('/login', async (req, res) => {
        const { username, password } = req.body;
        const validUser = await User.findAndValidatePassword(username, password);
        if (validUser) {
            req.session.user_id = validUser._id;
            res.render('./secret');
        } else {
            res.send('Name or pass wrong');
        }
    });

    app.get('/secret', (req, res) => {
        if (req.session.user_id) {
            return res.render('./secret');
        }
        res.render('./login');
    });

    app.post('/secret', (req, res) => {
        req.session.user_id = null;
        res.render('./login');
    })

    app.get('/topSecret', requireLogin, (req, res) => {
        res.send('Top Secret!');
    })

    app.listen(3000, () => {
        console.log('Listening to port 3000');
    })
}