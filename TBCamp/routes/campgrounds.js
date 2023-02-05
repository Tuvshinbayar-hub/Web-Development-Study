const express = require('express');
const router = express.Router();
const asyncWrapper = require("../utils/asyncWrapper");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { campgroundSchema, reviewSchema } = require("../schemas");
const ExpressError = require("../utils/expressError");

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

router.get("/campgrounds", asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({}).lean();
    res.render("./campgrounds/index", { campgrounds });
}));

router.get("/campgrounds/new", (req, res) => {
    res.render("./campgrounds/new");
});

router.post("/campgrounds/new", validateCampground, asyncWrapper(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect("/campgrounds");
}));

router.get("/campgrounds/:id", asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').lean();
    console.log(campground.reviews);
    res.render("./campgrounds/show", { campground });
}));

router.post("/campgrounds/:id/reviews", validateReview, asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    campground.reviews.push(newReview);

    await newReview.save();
    await campground.save();

    res.redirect(`/campgrounds/${campground.id}`);
}));

router.delete("/campgrounds/:id/reviews/:reviewId", asyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params;
    console.log(id);
    console.log(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

router.get("/campgrounds/:id/edit", asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).lean();
    res.render("./campgrounds/edit", { campground });
}));

router.patch("/campgrounds/:id/edit", validateCampground, asyncWrapper(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    res.redirect("/campgrounds");
}))

router.delete("/campgrounds/:id", asyncWrapper(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
}))

module.exports = router;