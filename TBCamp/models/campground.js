const mongoose = require("mongoose");
const Review = require('./review');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
  title: String,
  imgUrl: String,
  price: Number,
  description: String,
  location: String,
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
