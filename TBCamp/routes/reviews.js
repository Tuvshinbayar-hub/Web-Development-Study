const Review = require("../models/review");
const express = require('express');
const router = express.Router({ mergeParams: true }); //can access to ID's of general path

const asyncWrapper = require("../utils/asyncWrapper");
const ExpressError = require("../utils/expressError");

const Campground = require("../models/campground");
const { reviewSchema } = require("../schemas");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error !== undefined) {
        throw new ExpressError(401, error.details.map(err => err.message).join(','));
    } else {
        next();
    }
}

router.post("/", validateReview, asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    campground.reviews.push(newReview);

    await newReview.save();
    await campground.save();

    req.flash('success', 'Successfully created a review');
    res.redirect(`/campgrounds/${campground.id}`);
}));

router.delete("/:reviewId", asyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params;
    console.log(id);
    console.log(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;