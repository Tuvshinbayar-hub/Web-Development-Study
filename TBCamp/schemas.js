const Joi = require("joi");

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string()
            .min(3)
            .required(),
        imgUrl: Joi.string()
            .required(),
        price: Joi.number()
            .min(0)
            .required(),
        description: Joi.string()
            .required(),
        location: Joi.string()
            .required(),
    })
}).required()

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .min(1)
            .max(5)
            .required(),
        text: Joi.string()
            .required()
    }).required()
})

module.exports.campgroundSchema = campgroundSchema;
module.exports.reviewSchema = reviewSchema;