const express = require('express');
const router = express.Router();
const asyncWrapper = require("../utils/asyncWrapper");
const { campgrounds } = require("../controllers/campgrounds");
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const { storage } = require("../cloudinary/cloudinary");
const multer = require('multer');
const upload = multer({ storage })


router.get("/", asyncWrapper(campgrounds.index));

router.route('/new')
    .get(isLoggedIn, campgrounds.renderNewForm)
    // .post(upload.array('images'), async (req, res) => {
    //     await console.log(req.body, req.files);
    //     res.send(req.body);
    // });
    .post(isLoggedIn, upload.array('images'), validateCampground, asyncWrapper(campgrounds.createCampground));

router.route('/:id')
    .get(asyncWrapper(campgrounds.showCampground))
    .delete(isLoggedIn, isAuthor, asyncWrapper(campgrounds.destroyCampground));

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, asyncWrapper(campgrounds.renderEditForm))
    .patch(isLoggedIn, isAuthor, upload.array('images'), validateCampground, asyncWrapper(campgrounds.editCampground));

module.exports = router;