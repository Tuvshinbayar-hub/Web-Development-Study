const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware'); //can access to ID's of general path
const { reviews } = require('../controllers/reviews');

const asyncWrapper = require("../utils/asyncWrapper");

router.route('/')
    .get(asyncWrapper(reviews.renderCampground))
    .post(isLoggedIn, validateReview, asyncWrapper(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, asyncWrapper(reviews.destroyReview));

module.exports = router;