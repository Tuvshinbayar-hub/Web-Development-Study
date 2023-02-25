const Campground = require("./models/campground");
const Review = require("./models/review");
const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/expressError");

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        console.log(req.session.returnTo);
        req.flash('error', 'You must login first!');
        return res.redirect('/login');
    }
    next();
}

const isAuthor = async (req, res, next) => {
    const id = req.params.id;
    const tempCampground = await Campground.findById(id);
    if (!tempCampground.author._id.equals(res.locals.currentUser._id)) {
        req.flash('error', "You don't have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);

    if (error !== undefined) {
        throw new ExpressError(401, error.details.map(err => err.message).join(','));
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error !== undefined) {
        throw new ExpressError(401, error.details.map(err => err.message).join(','));
    } else {
        next();
    }
}

const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review.author._id.equals(res.locals.currentUser._id)) {
        req.flash('error', "You don't have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }

    next();
}

module.exports.isReviewAuthor = isReviewAuthor;
module.exports.validateCampground = validateCampground;
module.exports.isAuthor = isAuthor;
module.exports.isLoggedIn = isLoggedIn;
module.exports.validateReview = validateReview;
