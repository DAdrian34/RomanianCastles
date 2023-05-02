const express = require('express');
const router = express.Router();
const castles = require('../controllers/castles')
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, isAuthor, validateCastle } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


// const Castle = require('../models/castle');

router.route('/')
    .get(catchAsync(castles.index))
    .post(isLoggedIn, upload.array('image'), validateCastle, catchAsync(castles.createCastle))

router.get('/new', isLoggedIn, castles.newCastle)

router.route('/:id')
    .get(catchAsync(castles.showCastle))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCastle, catchAsync(castles.updateCastle))
    .delete(isLoggedIn, isAuthor, catchAsync(castles.deleteCastle))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(castles.editCastle));


module.exports = router;