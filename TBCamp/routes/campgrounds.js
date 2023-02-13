const express = require('express');
const router = express.Router();
const asyncWrapper = require("../utils/asyncWrapper");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas");
const ExpressError = require("../utils/expressError");

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);

    if (error !== undefined) {
        throw new ExpressError(401, error.details.map(err => err.message).join(','));
    } else {
        next();
    }
}

router.get("/", asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({}).lean();
    res.render("./campgrounds/index", { campgrounds });
}));

router.get("/new", (req, res) => {
    res.render("./campgrounds/new");
});

router.post("/new", validateCampground, asyncWrapper(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'You have successfully created a new campground!');
    res.redirect("/campgrounds");
}));

router.get("/:id", asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').lean();
    if (!campground) {
        req.flash('error', 'Cannot find a campground');
        return res.redirect("/campgrounds");
    }
    res.render("./campgrounds/show", { campground });
}));

router.get("/:id/edit", asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).lean();
    if (!campground) {
        req.flash('error', 'Cannot find a campground');
        return res.redirect("/campgrounds");
    }
    res.render("./campgrounds/edit", { campground });
}));

router.patch("/:id/edit", validateCampground, asyncWrapper(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    req.flash('success', 'You have successfully edited a campground!')
    res.redirect("/campgrounds");
}))

router.delete("/:id", asyncWrapper(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'You have succesfully deleted a campground');
    res.redirect("/campgrounds");
}))

module.exports = router;