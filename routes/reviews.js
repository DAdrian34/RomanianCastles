const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
// const Castle = require('../models/castle');
// const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const ExpressError = require('../utilities/ExpressError.js');
const catchAsync = require('../utilities/catchAsync');



router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;