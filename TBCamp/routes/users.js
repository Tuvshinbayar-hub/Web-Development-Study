const express = require('express');
const router = express.Router();

const asyncWrapper = require("../utils/asyncWrapper");
const { users } = require('../controllers/users');

const passport = require('passport');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(asyncWrapper(users.register));

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), asyncWrapper(users.login));
router.get('/logout', users.logout);

module.exports = router;