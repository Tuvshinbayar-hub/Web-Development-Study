const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRETKEY
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'TBCamp',
        allowedFormat: ['jpeg', 'png', 'jpg'] // supports promises as well
    },
});

module.exports = {
    storage,
    cloudinary
}