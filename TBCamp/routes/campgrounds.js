const express = require('express');
const router = express.Router();
const asyncWrapper = require("../utils/asyncWrapper");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

router.get("/", asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({}).lean();
    res.render("./campgrounds/index", { campgrounds });
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("./campgrounds/new");
});

router.post("/new", isLoggedIn, validateCampground, asyncWrapper(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    if (res.locals.currentUser)
        campground.author = res.locals.currentUser;
    await campground.save();
    req.flash('success', 'You have successfully created a new campground!');
    res.redirect("/campgrounds");
}));

router.get("/:id", asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('author').lean();
    if (!campground) {
        req.flash('error', 'Cannot find a campground');
        return res.redirect("/campgrounds");
    }
    res.render("./campgrounds/show", { campground });
}));

router.get("/:id/edit", isLoggedIn, isAuthor, asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).lean();
    if (!campground) {
        req.flash('error', 'Cannot find a campground');
        return res.redirect("/campgrounds");
    }
    res.render("./campgrounds/edit", { campground });
}));

router.patch("/:id/edit", isLoggedIn, isAuthor, validateCampground, asyncWrapper(async (req, res) => {
    const id = req.params.id;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'You have successfully edited a campground!')
    res.redirect("/campgrounds");
}))

router.delete("/:id", isLoggedIn, isAuthor, asyncWrapper(async (req, res) => {
    const id = req.params.id;

    await Campground.findByIdAndDelete(id);
    req.flash('success', 'You have succesfully deleted a campground');
    res.redirect("/campgrounds");
}))

module.exports = router;