const Review = require("../models/review");
const Campground = require("../models/campground");

const renderCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id);

    res.renderCampground(`/campgrounds/${campground.id}`);
}

const createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);

    if (res.locals.currentUser)
        newReview.author = res.locals.currentUser;
    campground.reviews.push(newReview);

    await newReview.save();
    await campground.save();

    req.flash('success', 'Successfully created a review');
    res.redirect(`/campgrounds/${campground.id}`);
}

const destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.reviews = {
    renderCampground,
    createReview,
    destroyReview
}