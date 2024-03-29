const { validationSchema, reviewSchema } = require('./utilities/joiSchema')
const ExpressError = require('./utilities/ExpressError');
const Castle = require('./models/castle');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login')
    }
    next();
}

module.exports.validateCastle = (req, res, next) => {
    const { error } = validationSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 404)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const castle = await Castle.findById(id);
    if (!castle.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission!')
        return res.redirect(`/castles/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/castles/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 404)
    } else {
        next();
    }
}