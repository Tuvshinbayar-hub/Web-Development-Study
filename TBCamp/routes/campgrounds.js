const express = require('express');
const router = express.Router();
const asyncWrapper = require("../utils/asyncWrapper");
const Campground = require("../models/campground");
const { campgrounds } = require("../controllers/campgrounds");
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

router.get("/", asyncWrapper(campgrounds.index));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.post("/new", isLoggedIn, validateCampground, asyncWrapper(campgrounds.createCampground));

router.get("/:id", asyncWrapper(campgrounds.showCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, asyncWrapper(campgrounds.renderEditForm));

router.patch("/:id/edit", isLoggedIn, isAuthor, validateCampground, asyncWrapper(campgrounds.editCampground));

router.delete("/:id", isLoggedIn, isAuthor, asyncWrapper(campgrounds.destroyCampground));

module.exports = router;