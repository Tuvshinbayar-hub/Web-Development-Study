const mongoose = require("mongoose");
const Review = require('./review');
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
});


campgroundSchema.post('findOneAndDelete', async (doc) => {
  await Review.deleteMany({ _id: { $in: doc.reviews } });
})

module.exports = mongoose.model("Campground", campgroundSchema);