const User = require('../models/user');

const renderRegisterForm = (req, res) => {
    res.render('./users/register');
}

const register = async (req, res) => {
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
}

const renderLoginForm = (req, res) => {
    res.render('./users/login');
}

const login = async (req, res) => {
    const redirectUrl = req.session.returnTo || '/campgrounds';
    req.flash('success', 'Welcome back!');
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

const logout = (req, res) => {
    req.logout((e) => {
        if (e) return next(e);
        req.flash('success', 'Logged out');
        res.redirect('/campgrounds');
    });
}

module.exports.users = {
    renderRegisterForm,
    register,
    renderLoginForm,
    login,
    logout
}