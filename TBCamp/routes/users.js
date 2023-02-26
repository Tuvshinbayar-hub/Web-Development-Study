const express = require('express');
const router = express.Router();

const asyncWrapper = require("../utils/asyncWrapper");
const { users } = require('../controllers/users');

const passport = require('passport');

router.get('/register', users.renderRegisterForm);

router.post('/register', asyncWrapper(users.register));

router.get('/login', users.renderLoginForm);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), asyncWrapper(users.login))

router.get('/logout', users.logout);

module.exports = router;