const express = require('express');
const router = express.Router();
const asyncWrapper = require("../utils/asyncWrapper");
const { campgrounds } = require("../controllers/campgrounds");
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');


router.get("/", asyncWrapper(campgrounds.index));

router.route('/new')
    .get(isLoggedIn, campgrounds.renderNewForm)
    .post(isLoggedIn, validateCampground, asyncWrapper(campgrounds.createCampground));

router.route('/:id')
    .get(asyncWrapper(campgrounds.showCampground))
    .delete(isLoggedIn, isAuthor, asyncWrapper(campgrounds.destroyCampground));

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, asyncWrapper(campgrounds.renderEditForm))
    .patch(isLoggedIn, isAuthor, validateCampground, asyncWrapper(campgrounds.editCampground));

module.exports = router;