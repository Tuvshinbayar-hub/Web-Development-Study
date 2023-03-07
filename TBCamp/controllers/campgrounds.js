const Campground = require("../models/campground");
const cloudinary = require("cloudinary").v2;

const index = async (req, res) => {
    const campgrounds = await Campground.find({}).lean();
    res.render("./campgrounds/index", { campgrounds });
}

const renderNewForm = (req, res) => {
    res.render("./campgrounds/new");
}

const createCampground = async (req, res, next) => {
    console.log(req.files, res.body);
    const files = req.files;

    const campground = new Campground(req.body.campground);
    const images = files.map(f => ({ url: f.path, fileName: f.filename }));
    console.log(files);
    campground.imgUrl = images;

    if (res.locals.currentUser)
        campground.author = res.locals.currentUser;
    await campground.save();
    req.flash('success', 'You have successfully created a new campground!');
    res.redirect("/campgrounds");
}

const showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('author').lean();
    if (!campground) {
        req.flash('error', 'Cannot find a campground');
        return res.redirect("/campgrounds");
    }
    res.render("./campgrounds/show", { campground });
}

const renderEditForm = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).lean();
    if (!campground) {
        req.flash('error', 'Cannot find a campground');
        return res.redirect("/campgrounds");
    }
    res.render("./campgrounds/edit", { campground });
}

const editCampground = async (req, res) => {
    const id = req.params.id;
    const files = req.files;
    const deleteImages = req.body.deleteImages;

    const images = files.map(f => ({ url: f.path, fileName: f.filename }));
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect(`/campgrounds`);
    }
    campground.imgUrl.push(...images);

    if (deleteImages) {
        for (let image of deleteImages) {
            cloudinary.uploader.destroy(image, function (result) { console.log(result) });
        }
        await campground.updateOne({ $pull: { imgUrl: { fileName: { $in: deleteImages } } } });
    }

    campground.save();
    req.flash('success', 'You have successfully edited a campground!')
    res.redirect(`/campgrounds/${id}`);
}

const destroyCampground = async (req, res) => {
    const id = req.params.id;

    await Campground.findByIdAndDelete(id);
    req.flash('success', 'You have succesfully deleted a campground');
    res.redirect("/campgrounds");
}

module.exports.campgrounds = {
    index,
    renderNewForm,
    createCampground,
    showCampground,
    renderEditForm,
    editCampground,
    destroyCampground
}