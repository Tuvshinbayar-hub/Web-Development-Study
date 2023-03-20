const Campground = require("../models/campground");
const cloudinary = require("cloudinary").v2;

const index = async (req, res) => {
    const campgrounds = await Campground.find({}).lean({virtuals: true});
    //res.send(typeof campgrounds);
    res.render("./campgrounds/index", { campgrounds});
}

const renderNewForm = (req, res) => {
    res.render("./campgrounds/new");
}

const createCampground = async (req, res, next) => {
    const files = req.files;

    const campground = new Campground(req.body.campground);
    const images = files.map(f => ({ url: f.path, fileName: f.filename }));
    campground.imgUrl = images;

    console.log('location is ', req.body.campground.location);

    //GeoCoding Section
    const configuration = {
        query: req.body.campground.location,
        limit: 1
    };

    var Geo = {
        forwardGeocode: async (config) => {
            const res = await fetch(
                `https://api.maptiler.com/geocoding/${encodeURIComponent(config.query)}.json?key=Sxim0MmX1cOFsGNNYJ49`
            );

            return await res.json();
        }
    };
    await Geo.forwardGeocode(configuration).then(res => { campground.location = res.features[0].geometry });


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
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find a campground');
        return res.redirect("/campgrounds");
    }
    console.log(campground.imgUrl)
    res.render("./campgrounds/edit", { campground: campground.toObject({ virtuals: true }) });
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
            cloudinary.uploader.destroy(image, function (result) { });
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
    req.flash('success', 'You have successfully deleted a campground');
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