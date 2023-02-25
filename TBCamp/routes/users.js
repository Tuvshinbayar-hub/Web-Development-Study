const express = require('express');
const router = express.Router();

const asyncWrapper = require("../utils/asyncWrapper");
const ExpressError = require("../utils/expressError");

const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('./users/register');
});

router.post('/register', asyncWrapper(async (req, res) => {
    try {
        const { username, password, email } = req.body.user;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, e => {
            if (e) next(e);
            req.flash('success', 'Welcome to TBcamp');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('./users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), asyncWrapper(async (req, res) => {
    const redirectUrl = req.session.returnTo || '/campgrounds';
    req.flash('success', 'Welcome back!');
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}))

router.get('/logout', (req, res) => {
    req.logout((e) => {
        if (e) return next(e);
        req.flash('success', 'Logged out');
        res.redirect('/campgrounds');
    });
});

module.exports = router;