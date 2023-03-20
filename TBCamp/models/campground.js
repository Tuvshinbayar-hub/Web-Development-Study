const mongoose = require("mongoose");
const Review = require('./review');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
  {
    url: String,
    fileName: String
  }
)

ImageSchema.virtual('thumbnail').get(function () {
  console.log('generating url', this.url);
  return this.url.replace('/upload', '/upload/w_300');
});
const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema({
  title: String,
  imgUrl: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  geometry:
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
}, opts);

campgroundSchema.virtual('properties.popupMarkup').get(function(){
  return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
})

campgroundSchema.plugin(mongooseLeanVirtuals);


campgroundSchema.post('findOneAndDelete', async (doc) => {
  await Review.deleteMany({ _id: { $in: doc.reviews } });
})

module.exports = mongoose.model("Campground", campgroundSchema);