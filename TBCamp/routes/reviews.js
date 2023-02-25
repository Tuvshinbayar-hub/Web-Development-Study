const Review = require("../models/review");
const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware'); //can access to ID's of general path

const asyncWrapper = require("../utils/asyncWrapper");
const Campground = require("../models/campground");

router.get("/", asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id);

    res.redirect(`/campgrounds/${campground.id}`);
}));

router.post("/", isLoggedIn, validateReview, asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);

    if (res.locals.currentUser)
        newReview.author = res.locals.currentUser;
    campground.reviews.push(newReview);

    await newReview.save();
    await campground.save();

    req.flash('success', 'Successfully created a review');
    res.redirect(`/campgrounds/${campground.id}`);
}));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, asyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    console.log('id is ', id);

    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;