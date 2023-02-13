const express = require('express');
const exphbs = require('express-handlebars');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const User = require('./models/user');
const { dir } = require('console');

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
        const hashedPw = await bcrypt.hash(username, 12);

        const user = new User({
            username,
            password: hashedPw
        })

        await user.save();
        res.redirect('/');
    })

    app.listen(3000, () => {
        console.log('Listening to port 3000');
    })
}